"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import request from "@/app/utils/api";
import { counselorLevelOptions, scheduleStatusType } from "@/app/utils/dic";
import { ProColumns } from "@ant-design/pro-components";
import {
  Alert,
  Calendar,
  CalendarProps,
  DatePicker,
  Form,
  Modal,
  Radio,
  Select,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

import { useAsyncEffect } from "ahooks";

import styles2 from "./page.module.scss";

import AuditContent from "@/app/components/AuditContent";
import { transformAttachment } from "@/app/utils/helper";

export default function Page() {
  const [level, setLevel] = useState(1);
  const [monthData, setMonthData] = useState();
  const [selectedDay, setSelectDay] = useState(dayjs());
  const [selectedItem, setSelectedItem] = useState<string>();
  const [fileList, setFileList] = useState<any[]>([]);

  const [form] = Form.useForm();

  const columns: ProColumns[] = [
    {
      title: "开始时间",
      dataIndex: "startTime",
      valueType: "dateTime",
      fieldProps: {
        format: "YYYY-MM-DD HH:mm",
      },
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      valueType: "dateTime",
      fieldProps: {
        format: "YYYY-MM-DD HH:mm",
      },
    },
    {
      title: "预约顾问",
      dataIndex: "counselorId",
      render: (dom, record) => record.counselor.username,
    },
    // {
    //   title: "学生",
    //   dataIndex: "studentId",
    //   render: (dom, record) => record.user?.username || '-'
    // },
    // {
    //   title: "学生就位",
    //   dataIndex: "userReady",
    //   valueEnum: scheduleReadyType,
    // },
    // {
    //   title: "顾问就位",
    //   dataIndex: "counselorReady",
    //   valueEnum: scheduleReadyType,
    // },
    {
      title: "状态",
      valueEnum: scheduleStatusType,
      dataIndex: "status",
      search: false,
    },
    {
      title: "创建时间",
      search: false,
      dataIndex: "createdAt",
      valueType: "dateTime",
    },
  ];

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (monthData) {
      const key = dayjs(current).format("YYYY-MM-DD");

      if (monthData[key]) {
        const options = (monthData[key] as any).map((item: any) => ({
          label: `${item.startTime}-${item.endTime}`,
          value: `${key} ${item.startTime}-${item.endTime}`,
        }));
        return (
          <Radio.Group
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            options={options}
          ></Radio.Group>
        );
      }
    }
    return <span></span>;
  };

  useAsyncEffect(async () => {
    const res = await request("/api/appointment", {
      params: { level, date: selectedDay.toISOString() },
    });
    setMonthData(res.data);
  }, [level]);

  return (
    <ExTable
      form={form}
      columns={columns}
      apiUrl={"/api/schedule"}
      title={"预约管理"}
      showCreateButton
      showDetailAction={false}
      optionRender={(record, onClick) => (
        <a key="edit" onClick={() => onClick(ModalType.detail)}>
          审核详情
        </a>
      )}
    >
      {(record, modalProps, { type, onOk }) => {
        let temp;

        if (type === ModalType.detail) {
          temp = {
            ...modalProps,
            title: "审核详情",
            onOk: () =>
              onOk(async (values) => {
                const data: any = {
                  message: values.message,
                  scheduleId: record.id,
                  status: 5,
                  attachment: transformAttachment(fileList),
                };

                await request("/api/appointment/audit", {
                  method: "POST",
                  data,
                });
              }),
            footer: (dom: any) => (record?.status === 6 ? dom : false),
          };
        } else {
          temp = {
            ...modalProps,
            title: "新建预约",
            width: 1200,
            onOk: () =>
              onOk(async () => {
                if (!selectedItem) {
                  throw new Error("请选择预约时间再提交");
                }

                const arr = selectedItem.split(" ");
                const date = arr[0];
                const times = arr[1].split("-");
                const data = {
                  level,
                  startTime: `${date} ${times[0]}`,
                  endTime: `${date} ${times[1]}`,
                };

                await request("/api/appointment", { method: "POST", data });
              }),
          };
        }

        return (
          <Modal {...temp}>
            {type === ModalType.create ? (
              <div className={styles2.body}>
                <Calendar
                  value={selectedDay}
                  onSelect={setSelectDay}
                  headerRender={(config) => (
                    <div className={styles2.header}>
                      <Alert
                        className={styles2.selectedMessage}
                        message={
                          selectedItem
                            ? `您预约的时间是: ${selectedItem}`
                            : `请选择预约时间`
                        }
                      />
                      <div>
                        <DatePicker size="large" {...config} />
                        <Select
                          size="large"
                          value={level}
                          options={counselorLevelOptions}
                          style={{ width: "120px" }}
                          onChange={setLevel}
                        />
                      </div>
                    </div>
                  )}
                  cellRender={cellRender}
                />
              </div>
            ) : (
              <AuditContent
                record={record}
                form={form}
                fileList={fileList}
                setFileList={setFileList}
                listKey={"scheduleAudit"}
                showEditor={record?.status === 6}
              />
            )}
          </Modal>
        );
      }}
    </ExTable>
  );
}

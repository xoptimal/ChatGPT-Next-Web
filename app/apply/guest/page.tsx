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
  Input,
  Modal,
  Radio,
  Select,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

import { useAsyncEffect } from "ahooks";

import styles from "@/app/service/product/page.module.scss";
import styles2 from "./page.module.scss";

import { getImageUrl } from "@/app/utils/helper";

const TextArea = Input.TextArea;

const auditOptions = [
  { label: "通过", value: 5 },
  { label: "驳回", value: 6 },
];
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(1);
  const [monthData, setMonthData] = useState();
  const [selectedDay, setSelectDay] = useState(dayjs());
  const [selectedItem, setSelectedItem] = useState<string>();

  const [form] = Form.useForm();

  const onSubmit = async (
    record: any,
    onSubmitCallback: any,
    type?: number,
  ) => {
    setLoading(true);

    try {
      if (type === ModalType.create) {
        if (!selectedItem) {
          message.warning("请选择预约时间再提交");
          return;
        }

        try {
          const arr = selectedItem.split(" ");
        const date = arr[0];
        const times = arr[1].split("-");
        const data = {
          level,
          startTime: `${date} ${times[0]}`,
          endTime: `${date} ${times[1]}`,
        };

        await request("/api/appointment", { method: "POST", data });
        onSubmitCallback();
        } finally {
          setLoading(false);
        }

        

      } else {

        //  审核详情
        form.validateFields().then(async (values) => {
          //const target = record.productAudit[record.productAudit.length - 1];
          // const data = {
          //   ...values,
          //   productId: record.id,
          //   targetId: target.id,
          // };
          //await request("/api/productAudit", { method: "PUT", data });
          onSubmitCallback();

        }).finally(() => {
          setLoading(false)
        });
      }

      
    
  };

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
    {
      title: "学生",
      dataIndex: "studentId",
      render: (dom, record) => record.user?.username || "-",
    },
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
      columns={columns}
      apiUrl={"/api/schedule"}
      title={"预约管理"}
      optionRender={(record, onClick) => (
        <a key="edit" onClick={() => onClick(ModalType.detail)}>
          审核详情
        </a>
      )}
    >
      {(record, modalProps, onSubmitCallback, type) => {
        let temp;

        if (type === ModalType.detail) {
          temp = {
            ...modalProps,
            title: "审核详情",
            confirmLoading: loading,
            onCancel: () => {
              form.resetFields();
              modalProps.onCancel();
            },
            onOk: async () => {
              await onSubmit(record, onSubmitCallback, type);
            },
            footer: (dom: any) => (record?.status === 5 ? dom : false),
          };
        } else {
          temp = {
            ...modalProps,
            confirmLoading: loading,
            title: "新建预约",
            width: 1200,
            onOk: async () => {
              await onSubmit(record, onSubmitCallback, type);
            },
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
              <div className={styles.modal_body}>
                <div className={styles.modal_body_list}>
                  {record?.scheduleAudit.map((item: any, index: number) => {
                    let attachmentList;
                    if (item.attachment) {
                      attachmentList = JSON.parse(item.attachment);
                      if (!Array.isArray(attachmentList)) {
                        attachmentList = [attachmentList];
                      }
                    }

                    return (
                      <div>
                        <div key={index}>
                          <div>
                            <h1>{record.user.username}</h1>
                            <span>
                              {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                            </span>
                          </div>
                          <div>{item.message}</div>
                          {attachmentList?.map((item) => (
                            <a
                              key={item.uid}
                              href={getImageUrl(item.uid)}
                              target="_blank"
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                        {item.auditMessage && (
                          <div key={index} className={styles.admin}>
                            <div>
                              <h1>系统管理员</h1>
                              <span>
                                {dayjs(item.updatedAt).format(
                                  "YYYY-MM-DD HH:mm",
                                )}
                              </span>
                            </div>
                            <div>{item.auditMessage}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {record?.status === 5 && (
                  <Form form={form} style={{ marginTop: "16px" }}>
                    <Form.Item
                      name={"status"}
                      label="审核"
                      rules={[{ required: true, message: "请选择" }]}
                    >
                      <Radio.Group options={auditOptions}></Radio.Group>
                    </Form.Item>
                    <Form.Item
                      name={"auditMessage"}
                      label="说明"
                      rules={[{ required: true, message: "请说明" }]}
                    >
                      <TextArea />
                    </Form.Item>
                  </Form>
                )}
              </div>
            )}
          </Modal>
        );
      }}
    </ExTable>
  );
}

"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import request from "@/app/utils/api";
import {
  COUNSELOR_TYPE,
  STUDENT_TYPE,
  scheduleStatusType,
} from "@/app/utils/dic";
import { BetaSchemaForm, ProColumns } from "@ant-design/pro-components";
import { Button, CalendarProps, Form, Modal, Radio, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

import { useAsyncEffect } from "ahooks";

import styles2 from "./page.module.scss";

import AuditContent from "@/app/components/AuditContent";
import { formatDate, transformAttachment } from "@/app/utils/helper";
import { PlusOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [level, setLevel] = useState(1);
  const [monthData, setMonthData] = useState();
  const [selectedDay, setSelectDay] = useState(dayjs());
  const [selectedItem, setSelectedItem] = useState<string>();
  const [fileList, setFileList] = useState<any[]>([]);
  const router = useRouter();

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
    {
      title: "咨询内容",
      dataIndex: "remark",
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

  const { data: session } = useSession();

  useAsyncEffect(async () => {
    if (session && session.user && !monthData) {
      const type = session.user.type;

      let level =
        type === STUDENT_TYPE.INTERMEDIATE || type === STUDENT_TYPE.ADVANCED
          ? COUNSELOR_TYPE.ADVANCED
          : COUNSELOR_TYPE.INTERMEDIATE;

      setLevel(level);

      const res = await request("/api/appointment", {
        params: { level, date: selectedDay.toISOString() },
      });
      setMonthData(res.data);
    }
  }, [session]);

  return (
    <ExTable
      form={form}
      columns={columns}
      apiUrl={"/api/schedule"}
      title={"预约管理"}
      showCreateButton
      showDetailAction={false}
      renderAddButton={(onClick) => (
        <Button
          key="create"
          icon={<PlusOutlined />}
          onClick={async () => {
            const { data } = await request("/api/psq");
            if (data) {
              // 说明可以预约
              onClick();
            } else {
              message.warning(
                "您需要先完善消息, 再进行预约, 2秒后自动跳转到个人信息页面",
              );
              setTimeout(() => {
                router.replace("/student/profile");
              }, 2000);
            }
          }}
          type="primary"
        >
          预约咨询
        </Button>
      )}
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
            title: "预约咨询",
            width: 600,
            onOk: () =>
              onOk(async (values) => {
                const times = values.time.split("-");
                const data = {
                  level,
                  startTime: `${values.date} ${times[0]}`,
                  endTime: `${values.date} ${times[1]}`,
                  remark: values.remark,
                };
                await request("/api/appointment", { method: "POST", data });
              }),
          };
        }

        return (
          <Modal {...temp}>
            {type === ModalType.create ? (
              <div className={styles2.body}>
                <BetaSchemaForm
                  form={form}
                  submitter={false}
                  grid
                  columns={[
                    {
                      title: "咨询内容",
                      dataIndex: "remark",
                      valueType: "textarea",
                      formItemProps: {
                        rules: [{ required: true, message: "此项为必填项" }],
                      },
                    },
                    {
                      title: "咨询日期",
                      dataIndex: "date",
                      valueType: "select",
                      formItemProps: {
                        rules: [{ required: true, message: "此项为必填项" }],
                      },
                      fieldProps: {
                        style: { width: "100%" },
                        options: monthData
                          ? Object.keys(monthData).map((item) => ({
                              label: item,
                              value: item,
                            }))
                          : [],
                      },
                    },
                    {
                      valueType: "dependency",
                      name: ["date"],
                      columns: ({ date }) => {
                        let list: any[] = [];
                        if (date && monthData) {
                          const key = formatDate(date);
                          list = monthData[key];
                        }

                        return [
                          {
                            title: "咨询时间段",
                            dataIndex: "time",
                            valueType: "select",
                            fieldProps: {
                              options: list.map((item: any) => ({
                                label: `${item.startTime}-${item.endTime}`,
                                value: `${item.startTime}-${item.endTime}`,
                              })),
                            },
                            formItemProps: {
                              shouldUpdate: (
                                prevValues: any,
                                curValues: any,
                              ) => {
                                if (prevValues.date !== curValues.date) {
                                  form.setFieldValue("time", undefined);
                                  form.resetFields(["time"]);
                                }

                                return prevValues.date !== curValues.date;
                              },
                              rules: [
                                { required: true, message: "此项为必填项" },
                              ],
                            },
                          },
                        ];
                      },
                    },
                  ]}
                ></BetaSchemaForm>

                {/* <Calendar
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
                          options={counselorLevelToStudentOptions}
                          style={{ width: "120px" }}
                          onChange={setLevel}
                        />
                      </div>
                    </div>
                  )}
                  cellRender={cellRender}
                /> */}
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

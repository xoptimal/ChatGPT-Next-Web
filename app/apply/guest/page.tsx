"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import request from "@/app/utils/api";
import { scheduleStatusType } from "@/app/utils/dic";
import { ProColumns } from "@ant-design/pro-components";
import { Empty, Form, Input, Modal, Radio } from "antd";
import dayjs from "dayjs";

import styles from "@/app/service/product/page.module.scss";

import { getImageUrl } from "@/app/utils/helper";

const TextArea = Input.TextArea;

const auditOptions = [
  { label: "通过", value: 1 },
  { label: "驳回", value: 6 },
];
export default function Page() {
  const [form] = Form.useForm();

  const columns: ProColumns[] = [
    {
      title: "开始时间",
      dataIndex: "startTime",
      valueType: "dateTime",
      fieldProps: {
        format: "YYYY-MM-DD HH:mm",
      },
      search: false,
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      valueType: "dateTime",
      fieldProps: {
        format: "YYYY-MM-DD HH:mm",
      },
      search: false,
    },
    {
      title: "预约顾问",
      dataIndex: "counselorId",
      render: (dom, record) => record.counselor.username,
      search: false,
    },
    {
      title: "学生",
      dataIndex: "studentId",
      render: (dom, record) => record.user?.username || "-",
      search: false,
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

  return (
    <ExTable
      form={form}
      columns={columns}
      apiUrl={"/api/schedule"}
      title={"普通客户预约列表"}
      optionRender={(record, onClick) => (
        <a key="edit" onClick={() => onClick(ModalType.detail)}>
          审核详情
        </a>
      )}
    >
      {(record, modalProps, { onOk }) => {
        const temp = {
          ...modalProps,
          title: "审核详情",
          footer: (dom: any) => (record?.status === 5 ? dom : false),
          width: 640,
        };

        return (
          <Modal
            {...temp}
            onOk={onOk(async (values) => {
              const target =
                record.scheduleAudit[record.scheduleAudit.length - 1];
              const data = {
                ...values,
                scheduleId: record.id,
                targetId: target.id,
              };
              await request("/api/schedule", { method: "PUT", data });
            })}
          >
            <div className={styles.modal_body}>
              {record?.status === 0 && <Empty />}
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
                              {dayjs(item.updatedAt).format("YYYY-MM-DD HH:mm")}
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
          </Modal>
        );
      }}
    </ExTable>
  );
}

"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import request from "@/app/utils/api";
import { productEnum, productStatusEnum } from "@/app/utils/dic";
import { ProColumns } from "@ant-design/pro-components";
import { Form, Input, Modal, Radio } from "antd";
import dayjs from "dayjs";

import styles from "@/app/service/product/page.module.scss";

import { getImageUrl } from "@/app/utils/helper";

const TextArea = Input.TextArea;

const auditOptions = [
  { label: "通过", value: 1 },
  { label: "驳回", value: 2 },
];

export default function Page() {
  const [form] = Form.useForm();

  const columns: ProColumns[] = [
    {
      title: "申请级别",
      dataIndex: "type",
      valueEnum: productEnum,
    },
    {
      title: "姓名",
      dataIndex: "username",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "状态",
      key: "status",
      dataIndex: "status",
      valueEnum: productStatusEnum,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      valueType: "dateTime",
      search: false,
    },
  ];

  return (
    <ExTable
      form={form}
      columns={columns}
      apiUrl={"/api/product"}
      title={"顾问申请列表"}
      optionRender={(record, onClick) => (
        <a key="detail" onClick={() => onClick(ModalType.detail)}>
          审核详情
        </a>
      )}
    >
      {(record, modalProps, { onOk }) => {
        const temp = {
          ...modalProps,
          title: "审核详情",
          footer: (dom: any) => (record?.status === 0 ? dom : false),
          width: 640,
        };

        return (
          <Modal
            {...temp}
            onOk={() =>
              onOk(async (values) => {
                const target =
                  record.productAudit[record.productAudit.length - 1];
                const data = {
                  ...values,
                  productId: record.id,
                  targetId: target.id,
                };
                await request("/api/productAudit", { method: "PUT", data });
              })
            }
          >
            <div className={styles.modal_body}>
              <div className={styles.modal_body_list}>
                {record?.productAudit.map((item: any, index: number) => {
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
                          <h1>{record.username}</h1>
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
              {record?.status === 0 && (
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

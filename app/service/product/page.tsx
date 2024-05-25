"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import { productColumns } from "@/app/profile/page";
import { Form, Image, Input, Modal, Radio } from "antd";

import request from "@/app/utils/api";
import dayjs from "dayjs";
import styles from "./page.module.scss";

const TextArea = Input.TextArea;

const auditOptions = [
  { label: "通过", value: 1 },
  { label: "驳回", value: 2 },
];

export default function Page() {
  const [form] = Form.useForm();

  return (
    <ExTable
      form={form}
      columns={productColumns}
      apiUrl={"/api/product"}
      title={"签约客户管理"}
      modalTitle={"审核详情"}
      optionRender={(record, onClick) => (
        <a key="edit" onClick={() => onClick(ModalType.detail)}>
          审核详情
        </a>
      )}
    >
      {(record, modalProps, { type, onOk }) => (
        <Modal
          {...modalProps}
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
          footer={(dom) => (record?.status === 0 ? dom : false)}
        >
          <div className={styles.modal_body}>
            <div className={styles.modal_body_list}>
              {record?.productAudit.map((item: any, index: number) => (
                <div>
                  <div key={index}>
                    <div>
                      <h1>{record.username}</h1>
                      <span>
                        {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                      </span>
                    </div>
                    <div>{item.message}</div>
                    <div>
                      <Image
                        className={styles.attachment}
                        src={item.attachment}
                      />
                    </div>
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
              ))}
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
      )}
    </ExTable>
  );
}

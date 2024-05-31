"use client";

import { Form, Input, Radio, Space } from "antd";

import styles from "@/app/service/product/page.module.scss";

import {
  formatAttachmentToList,
  formatDate,
  getImageUrl,
} from "@/app/utils/helper";

const defAuditOptions = [
  { label: "通过", value: 1 },
  { label: "驳回", value: 2 },
];

const TextArea = Input.TextArea;

export default function AdminAuditContent(props: any) {
  const {
    record,
    form,
    showEditor = false,
    auditOptions = defAuditOptions,
    listKey = "productAudit",
    name,
    renderAction,
  } = props;

  return (
    <div className={styles.modal_body}>
      {props.children}
      <div className={styles.modal_body_list}>
        {record?.[listKey].map((item: any, index: number) => {
          const attachmentList = formatAttachmentToList(item.attachment);
          return (
            <div key={item.id}>
              <div>
                <div className={styles.modal_body_title}>
                  <div className={styles.left}>
                    <h1>{name || record?.username}</h1>
                    <span>
                      {formatDate(item.createdAt, { showTime: true })}
                    </span>
                  </div>

                  {index === 0 && <Space className={styles.right}>{renderAction?.(item)}</Space>}
                </div>
                <div dangerouslySetInnerHTML={{ __html: item.message }}></div>
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
                      {formatDate(item.updatedAt, { showTime: true })}
                    </span>
                  </div>
                  <div>{item.auditMessage}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showEditor && (
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
  );
}

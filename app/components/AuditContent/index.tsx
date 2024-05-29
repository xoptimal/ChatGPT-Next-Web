"use client";
import ExUpload from "@/app/components/ExUpload";
import styles from "@/app/service/product/page.module.scss";
import {
  formatAttachmentToList,
  formatDate,
  getImageUrl,
} from "@/app/utils/helper";
import { Form, Input } from "antd";

const TextArea = Input.TextArea;

export default function AuditContent(props: any) {
  const { record, form, fileList, setFileList, showEditor=false } = props;

  return (
    <div className={styles.modal_body}>
      <div className={styles.modal_body_list}>
        {record?.productAudit.map((item: any, index: number) => {
          const attachmentList = formatAttachmentToList(item.attachment);
          return (
            <div>
              <div key={index}>
                <div>
                  <h1>您</h1>
                  <span>{formatDate(item.createdAt, { showTime: true })}</span>
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
        <Form form={form} labelCol={{ span: 2 }} style={{ marginTop: "16px" }}>
          <Form.Item
            name={"message"}
            label="说明"
            rules={[{ required: true, message: "请说明" }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item label="附件">
            <ExUpload
              fileList={fileList}
              onChange={(info: any) => {
                setFileList(info.fileList);
              }}
            />
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import { Form, Modal } from "antd";

import AdminAuditContent from "@/app/components/AdminAuditContent";
import request from "@/app/utils/api";
import { productColumns } from "@/app/student/apply/columns";

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
          <AdminAuditContent
            record={record}
            form={form}
            showEditor={record?.status === 0}
          />
        </Modal>
      )}
    </ExTable>
  );
}

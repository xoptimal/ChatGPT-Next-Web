"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import request from "@/app/utils/api";
import { productEnum, productStatusEnum } from "@/app/utils/dic";
import { ProColumns } from "@ant-design/pro-components";
import { Form, Modal } from "antd";

import AdminAuditContent from "@/app/components/AdminAuditContent";

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
            <AdminAuditContent
              record={record}
              form={form}
              showEditor={record?.status === 0}
            />
          </Modal>
        );
      }}
    </ExTable>
  );
}

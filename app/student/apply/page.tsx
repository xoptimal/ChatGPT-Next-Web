"use client";
import AuditContent from "@/app/components/AuditContent";
import { getSideMenus } from "@/app/components/ExContent";
import ExTable, { ModalType } from "@/app/components/ExTable";
import SideContainer from "@/app/components/SideContainer";
import request from "@/app/utils/api";
import { transformAttachment } from "@/app/utils/helper";
import { Form, Modal } from "antd";
import { useSession } from "next-auth/react";
import { useState } from "react";

const productEnum = {
  1: "VVVIP",
  2: "加州精英服务",
};

const productStatusEnum = {
  1: {
    text: "通过",
    status: "Success",
  },
  2: {
    status: "Error",
    text: "驳回",
  },
  0: {
    status: "Processing",
    text: "待审核",
  },
};

const productColumns: any[] = [
  {
    title: "签约产品",
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
    title: "金额",
    key: "price",
    dataIndex: "price",
    valueType: "money",
    search: false,
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

export default function Page() {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  return (
    <SideContainer
      title="我的签约"
      items={getSideMenus(session?.user.role, false)}
    >
      <ExTable
        form={form}
        title="我的签约"
        modalTitle={"审核详情"}
        optionRender={(record, onClick) => (
          <a key="edit" onClick={() => onClick(ModalType.detail)}>
            审核详情
          </a>
        )}
        tableProps={{
          tableRender: (props, dom, domList) => domList.table,
          search: false,
        }}
        columns={productColumns}
        apiUrl={"/api/product"}
      >
        {(record, modalProps, { onOk }) => (
          <Modal
            {...modalProps}
            onOk={() =>
              onOk(async (values) => {
                const data = {
                  message: values.message,
                  productId: record.id,
                  attachment: transformAttachment(fileList),
                  status: 0,
                };
                await request("/api/productAudit", { method: "POST", data });
              })
            }
            footer={(dom) => (record?.status === 2 ? dom : false)}
          >
            <AuditContent
              record={record}
              form={form}
              fileList={fileList}
              setFileList={setFileList}
              showEditor={record?.status === 2}
            />
          </Modal>
        )}
      </ExTable>
    </SideContainer>
  );
}

export { productColumns };

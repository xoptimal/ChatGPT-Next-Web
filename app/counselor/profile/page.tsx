"use client";
import { getSideMenus } from "@/app/components/ExContent";
import SideContainer from "@/app/components/SideContainer";
import request from "@/app/utils/api";
import { BetaSchemaForm } from "@ant-design/pro-components";
import { Input, message } from "antd";
import { useSession } from "next-auth/react";

const TextArea = Input.TextArea;

const columns: any[] = [
  {
    title: "姓名",
    dataIndex: "username",
  },
  {
    title: "电话",
    dataIndex: "phone",
    valueType: "digit",
    width: "100%",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "国籍",
    dataIndex: "country",
  },
];

export default function Page() {
  const { data: session } = useSession();

  return (
    <SideContainer
      title="个人信息"
      items={getSideMenus(session?.user.role, false)}
    >
      <BetaSchemaForm
        style={{ width: "800px" }}
        grid
        rowProps={{
          gutter: [16, 16],
        }}
        colProps={{
          span: 12,
        }}
        submitter={{
          searchConfig: {
            submitText: "更新个人信息",
          },
          render: (_, doms) => {
            return [doms[1]];
          },
        }}
        onFinish={async (values) => {
          await request("/api/user/profile", { method: "PUT", data: values });
          message.success("更新成功");
        }}
        request={() => request("/api/user/profile").then((res) => res.data)}
        columns={columns}
      />
    </SideContainer>
  );
}

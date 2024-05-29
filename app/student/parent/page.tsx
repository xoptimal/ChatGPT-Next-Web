"use client";
import { getSideMenus } from "@/app/components/ExContent";
import SideContainer from "@/app/components/SideContainer";
import { BetaSchemaForm, ProCard, ProForm } from "@ant-design/pro-components";
import { useSession } from "next-auth/react";

const columns: any[] = [
  {
    title: "姓名",
    dataIndex: "username",
  },
  {
    title: "年龄",
    dataIndex: "age",
    valueType: "digit",
    width: "100%",
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
    title: "职业",
    dataIndex: "job",
  },
  {
    title: "岗位",
    dataIndex: "jobName",
  },
];

export default function Page() {
  const { data: session } = useSession();

  return (
    <SideContainer title="家长信息" items={getSideMenus(session?.user.role, false)}>
      <ProForm
        submitter={{
          searchConfig: {
            submitText: "更新家长信息",
          },
          render: (_, doms) => {
            return [doms[1]];
          },
        }}
      >
        <ProCard
          title={"家长1"}
          bordered={false}
          headerBordered
          ghost
          style={{ width: "800px" }}
          bodyStyle={{ marginTop: "16px" }}
        >
          <BetaSchemaForm
            grid
            rowProps={{
              gutter: [16, 16],
            }}
            colProps={{
              span: 8,
            }}
            submitter={false}
            // onFinish={async (values) => {
            //     await request('/api/user/profile', {method: 'PUT', data: values});
            //     message.success("更新成功")
            // }}
            // request={() => request('/api/user/profile').then(res => res.data)}
            columns={columns}
          />
        </ProCard>
        <ProCard
          title={"家长2"}
          bordered={false}
          headerBordered
          ghost
          style={{ width: "800px" }}
          bodyStyle={{ marginTop: "16px" }}
        >
          <BetaSchemaForm
            grid
            rowProps={{
              gutter: [16, 16],
            }}
            colProps={{
              span: 8,
            }}
            submitter={false}
            // onFinish={async (values) => {
            //     await request('/api/user/profile', {method: 'PUT', data: values});
            //     message.success("更新成功")
            // }}
            // request={() => request('/api/user/profile').then(res => res.data)}
            columns={columns}
          />
        </ProCard>
      </ProForm>
    </SideContainer>
  );
}

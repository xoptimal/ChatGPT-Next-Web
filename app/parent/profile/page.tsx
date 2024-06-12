"use client";
import ExContainer, { ExContainerRef } from "@/app/components/ExContainer";
import { getSideMenus } from "@/app/components/ExContent";
import SideContainer from "@/app/components/SideContainer";
import request from "@/app/utils/api";
import { BetaSchemaForm } from "@ant-design/pro-components";
import { Form, message } from "antd";
import { useSession } from "next-auth/react";
import { useMemo, useRef, useState } from "react";
// @ts-ignore

export default function Page() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(session?.user);
  const columns = useMemo(() => {
    return [
      {
        title: "个人信息",
        valueType: "group",
        colProps: { span: 24 },
        columns: [
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
        ],
      },
    ];
  }, [data]);

  const [form] = Form.useForm();
  const containerRef = useRef<ExContainerRef>(null);

  return (
    <SideContainer
      title="个人信息"
      items={getSideMenus(session?.user.role, false)}
    >
      <ExContainer
        ref={containerRef}
        request={async () => {
          const res = await request("/api/user/profile");
          setData(res.data);
          form.setFieldsValue(res.data);
        }}
      >
        <BetaSchemaForm
          style={{ width: "800px" }}
          grid
          rowProps={{
            gutter: [16, 16],
          }}
          form={form}
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
            await request("/api/user/profile", {
              method: "PUT",
              data: { ...data, ...values },
            });

            setData(values);
            message.success("更新成功");

            //  刷新页面
            containerRef.current?.refresh();
          }}
          columns={columns}
        ></BetaSchemaForm>
      </ExContainer>
    </SideContainer>
  );
}

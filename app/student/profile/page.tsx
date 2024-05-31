"use client";
import { getSideMenus } from "@/app/components/ExContent";
import PsqButton from "@/app/components/PsqButton";
import SideContainer from "@/app/components/SideContainer";
import request from "@/app/utils/api";
import { UNIVERSITIES } from "@/app/utils/dic";
import { BetaSchemaForm } from "@ant-design/pro-components";
import { message } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const formItemProps = {
  rules: [
    {
      required: true,
      message: "此项为必填项",
    },
  ],
};

function initParentColumns(key: string, param?: any) {
  return [
    {
      title: "姓名",
      dataIndex: key + "_username",
      formItemProps: param,
    },
    {
      title: "年龄",
      dataIndex: key + "_age",
      valueType: "digit",
      width: "100%",
      formItemProps: param,
    },
    {
      title: "电话",
      dataIndex: key + "_phone",
      valueType: "digit",
      width: "100%",
      formItemProps: param,
    },
    {
      title: "邮箱",
      dataIndex: key + "_email",
      formItemProps: param,
    },
    {
      title: "职业",
      dataIndex: key + "_job",
      formItemProps: param,
    },
    {
      title: "岗位",
      dataIndex: key + "_jobName",
      formItemProps: param,
    },
  ];
}

const columns: any[] = [
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
        title: "学校",
        key: "school",
        dataIndex: "school",
        valueEnum: UNIVERSITIES,
      },
      {
        title: "年级",
        dataIndex: "class",
      },
      {
        title: "学号",
        dataIndex: "studentId",
        formItemProps,
      },
      {
        title: "成绩",
        dataIndex: "score",
        valueType: "digit",
        width: "100%",
        formItemProps,
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
        title: "地址",
        dataIndex: "address",
        valueType: "textarea",
        colProps: { span: 24 },
        formItemProps,
      },
    ],
  },

  {
    title: "家长1",
    valueType: "group",
    colProps: { span: 24 },
    columns: initParentColumns("parent1", formItemProps),
  },
  {
    title: "家长2",
    valueType: "group",
    colProps: { span: 24 },
    columns: initParentColumns("parent2"),
  },
];

function checkParent(data: any, parentKey: string) {
  return (
    data[`${parentKey}_email`] &&
    data[`${parentKey}_phone`] &&
    data[`${parentKey}_username`]
  );
}

export default function Page() {
  
  const { data: session } = useSession();
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>(session?.user);

  useEffect(() => {
    if (
      data &&
      data.studentId &&
      data.address &&
      data.score &&
      checkParent(data, "parent1")
    ) {
      setShow(true);
    }
  }, [data]);

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
            return [doms[1], show && <PsqButton key="psq">下一步</PsqButton>];
          },
        }}
        onFinish={async (values) => {

          await request("/api/user/profile", {
            method: "PUT",
            data: values,
          });

          setData(values);
          message.success("更新成功");
        }}
        request={async () => {
          const res = await request("/api/user/profile");
          setData(res.data);
          return res.data;
        }}
        columns={columns}
      ></BetaSchemaForm>
    </SideContainer>
  );
}

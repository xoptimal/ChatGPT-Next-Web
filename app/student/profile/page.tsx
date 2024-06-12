"use client";
import { getSideMenus } from "@/app/components/ExContent";
import PsqButton from "@/app/components/PsqButton";
import SideContainer from "@/app/components/SideContainer";
import request from "@/app/utils/api";
import { UNIVERSITIES } from "@/app/utils/dic";
import { BetaSchemaForm, ProDescriptions } from "@ant-design/pro-components";
import { Button, Descriptions, Modal, Result, Space, message } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

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

  const [buttons, setButtons] = useState({ parent1: false, parent2: false });

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
        title: buttons.parent1 ? (
          <Space>
            <span>家长1</span>
            <Button
              onClick={() =>
                setModal({
                  open: true,
                  data: [
                    { label: "账号", value: data["parent1_email"] },
                    { label: "密码", value: data["parent1_phone"] },
                  ],
                })
              }
            >
              生成账号
            </Button>
          </Space>
        ) : (
          "家长1"
        ),
        valueType: "group",
        colProps: { span: 24 },
        columns: initParentColumns("parent1", formItemProps),
      },
      {
        title: buttons.parent2 ? (
          <Space>
            <span>家长2</span>
            <Button>生成账号</Button>
          </Space>
        ) : (
          "家长2"
        ),
        valueType: "group",
        colProps: { span: 24 },
        columns: initParentColumns("parent2"),
      },
    ];
  }, [buttons, data]);

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

  const [modal, setModal] = useState<any>({ open: false, data: null });

  async function checkParentUser(user: any) {
    const parent1 = checkParent(user, "parent1");
    const parent2 = checkParent(user, "parent2");
    const { data } = await request("/api/user/parent");

    let temp = { parent1: false, parent2: false };

    if (parent1) {
      //  填写了信息
      const find1 = data.find(
        (find: any) => find.parent && find.parent.id === user["parent1_id"],
      );
      if (!find1) {
        //  说明没有关联, 展示按钮
        temp.parent1 = true;
      }
    }

    if (parent2) {
      //  填写了信息
      const find1 = data.find(
        (find: any) => find.parent && find.parent.id === user["parent2_id"],
      );
      if (!find1) {
        //  说明没有关联, 展示按钮
        temp.parent2 = true;
      }
    }

    setButtons(temp);
  }

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
          checkParentUser(res.data);
          return res.data;
        }}
        columns={columns}
      ></BetaSchemaForm>

      <Modal
        title={`生成账号`}
        open={modal.open}
        onCancel={() => setModal({ open: false, data: null })}
        onOk={() => {

          //  on ok
          setModal((prev: any) => ({...prev, result: true}))

        }}
      >
        {
          modal.result ? <Result></Result> : <Descriptions column={1} title={`家长:${data["parent1_username"]} 账号密码`}>
          {modal.data &&
            modal.data.map((item: any) => (
              <Descriptions.Item key={item.value} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
        </Descriptions>
        }
      </Modal>
    </SideContainer>
  );
}

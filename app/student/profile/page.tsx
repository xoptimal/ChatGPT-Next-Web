"use client";
import ExContainer, { ExContainerRef } from "@/app/components/ExContainer";
import { getSideMenus } from "@/app/components/ExContent";
import PsqButton from "@/app/components/PsqButton";
import SideContainer from "@/app/components/SideContainer";
import request from "@/app/utils/api";
import { CopyOutlined } from "@ant-design/icons";
import { BetaSchemaForm } from "@ant-design/pro-components";
import {
  Button,
  Descriptions,
  Form,
  Modal,
  Result,
  Space,
  message,
} from "antd";
import md5 from "crypto-js/md5";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore
import CopyToClipboard from "react-copy-to-clipboard";

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
                  data: {
                    email: data["parent1_email"],
                    password: data["parent1_phone"].toString(),
                    phone: data["parent1_phone"].toString(),
                    username: data["parent1_username"],
                    info: {
                      age: data["parent1_age"],
                      job: data["parent1_job"],
                      jobName: data["parent1_jobName"],
                    },
                  },
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
            <Button
              onClick={() =>
                setModal({
                  open: true,
                  data: {
                    email: data["parent2_email"],
                    password: data["parent2_phone"].toString(),
                    phone: data["parent2_phone"].toString(),
                    username: data["parent2_username"],
                    info: {
                      age: data["parent2_age"],
                      job: data["parent2_job"],
                      jobName: data["parent2_jobName"],
                    },
                  },
                })
              }
            >
              生成账号
            </Button>
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
        (find: any) => find.parentId === user["parent1_id"],
      );

      console.log("find1", find1);

      if (!find1) {
        //  说明没有关联, 展示按钮
        temp.parent1 = true;
      }
    }

    if (parent2) {
      //  填写了信息
      const find2 = data.find(
        (find: any) => find.parentId === user["parent2_id"],
      );

      if (!find2) {
        //  说明没有关联, 展示按钮
        temp.parent2 = true;
      }
    }
    setButtons(temp);
  }

  const onCopy = useCallback(() => {
    message.success("复制成功, 赶紧发给家长吧!");
  }, []);

  const [form] = Form.useForm();
  const containerRef = useRef<ExContainerRef>(null);

  const copyValue = modal.resultData?.created
    ? `欢迎来到恩代
    恩代地址: https://endai.vercel.app/
    账号已存在, 请直接让家长登录查看关联!`
    : `欢迎来到恩代
    恩代地址: https://endai.vercel.app/
    账号: ${modal.data?.email} 密码: ${modal.data?.password}`;

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
          checkParentUser(res.data);
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
              return [doms[1], show && <PsqButton key="psq">下一步</PsqButton>];
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

      <Modal
        title={`生成家长账号`}
        open={modal.open}
        confirmLoading={modal.loading}
        onCancel={() => setModal({ open: false, data: null })}
        onOk={async () => {
          //  loading
          setModal((prev: any) => ({ ...prev, loading: true }));

          //  md5
          const password = md5(modal.data.password).toString();
          const data = { ...modal.data, password };

          // register
          const resultRes = await request("/api/user/parent", {
            data,
            method: "post",
          });

          //  result
          setModal((prev: any) => ({
            ...prev,
            loading: false,
            result: true,
            resultData: resultRes.data,
          }));

          //刷新数据
          containerRef.current?.refresh();
        }}
        footer={(originNode) => (modal.result ? false : originNode)}
      >
        {modal.result ? (
          <Result
            rootClassName="create-result"
            status="success"
            title={modal.resultData?.created ? "账号关联成功" : "账号创建成功"}
            subTitle={copyValue}
            extra={ !modal.resultData?.created &&
              <CopyToClipboard onCopy={onCopy} text={copyValue}>
                <Button
                  type="primary"
                  key="console"
                  icon={<CopyOutlined />}
                  onClick={() => {}}
                >
                  复制
                </Button>
              </CopyToClipboard>
            }
          ></Result>
        ) : (
          <Descriptions
            column={1}
            title="初始账号密码如下:"
            bordered
            size="small"
          >
            <Descriptions.Item label={"账号"}>
              {modal.data?.email}
            </Descriptions.Item>
            <Descriptions.Item label={"密码"}>
              {modal.data?.password}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </SideContainer>
  );
}

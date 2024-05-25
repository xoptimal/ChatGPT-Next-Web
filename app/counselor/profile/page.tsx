"use client";
import ExTable, { ModalType } from "@/app/components/ExTable";
import ExUpload from "@/app/components/ExUpload";
import styles from "@/app/service/product/page.module.scss";
import request from "@/app/utils/api";
import { productEnum, productStatusEnum } from "@/app/utils/dic";
import { getImageUrl } from "@/app/utils/helper";
import { MailOutlined } from "@ant-design/icons";
import { BetaSchemaForm, ProCard } from "@ant-design/pro-components";
import { Form, Input, Menu, Modal, message } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

const TextArea = Input.TextArea;

function StudentView() {
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

  return (
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
  );
}

const productColumns: any[] = [
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

function ProductView() {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>();

  return (
    <ExTable
      form={form}
      hideTitle
      modalTitle={"审核详情"}
      optionRender={(record, onClick) => (
        <a key="edit" onClick={() => onClick(ModalType.detail)}>
          审核详情
        </a>
      )}
      onModalChange={() => {
        setImageUrl(null);
      }}
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
                attachment: imageUrl,
                status: 0,
              };
              await request("/api/productAudit", { method: "POST", data });
            })
          }
          footer={(dom) => (record?.status === 2 ? dom : false)}
        >
          <div className={styles.modal_body}>
            <div className={styles.modal_body_list}>
              {record?.productAudit.map((item: any, index: number) => {
                let attachmentList;
                if (item.attachment) {
                  attachmentList = JSON.parse(item.attachment);
                  if (!Array.isArray(attachmentList)) {
                    attachmentList = [attachmentList];
                  }
                }

                return (
                  <div>
                    <div key={index}>
                      <div>
                        <h1>您</h1>
                        <span>
                          {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                        </span>
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
                            {dayjs(item.updatedAt).format("YYYY-MM-DD HH:mm")}
                          </span>
                        </div>
                        <div>{item.auditMessage}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {record?.status === 2 && (
              <Form
                form={form}
                labelCol={{ span: 2 }}
                style={{ marginTop: "16px" }}
              >
                <Form.Item
                  name={"message"}
                  label="说明"
                  rules={[{ required: true, message: "请说明" }]}
                >
                  <TextArea />
                </Form.Item>
                <Form.Item label="附件">
                  <ExUpload
                    imageClassName={styles.icon_attachment}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                  />
                </Form.Item>
              </Form>
            )}
          </div>
        </Modal>
      )}
    </ExTable>
  );
}

export default function Page() {
  const [activeKey, setActiveKey] = useState("product");

  const [title, content] = useMemo(() => {
    switch (activeKey) {
      case "student":
        return ["个人信息", <StudentView />];
      default:
        return ["我的申请", <ProductView />];
    }
  }, [activeKey]);

  return (
    <ProCard split="vertical">
      <ProCard colSpan="200px" ghost>
        <Menu
          mode={"inline"}
          style={{
            padding: "4px",
          }}
          selectedKeys={[activeKey]}
          onClick={({ key }) => setActiveKey(key)}
          items={[
            {
              key: "student",
              label: "个人信息",
              icon: <MailOutlined />,
            },
            {
              key: "product",
              label: "我的申请",
              icon: <MailOutlined />,
            },
          ]}
        ></Menu>
      </ProCard>
      <ProCard title={title} bodyStyle={{ minHeight: "calc(100vh - 200px)" }}>
        {content}
      </ProCard>
    </ProCard>
  );
}

export { productColumns };


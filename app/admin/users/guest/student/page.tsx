"use client";
import ExTable, { ModalType } from "@/app/components/ExTable";
import request from "@/app/utils/api";
import {
  ROLE,
  UNIVERSITIES,
  studentEnum,
  studentOptions,
} from "@/app/utils/dic";
import {
  BetaSchemaForm,
  ProDescriptions,
  ProDescriptionsItemProps,
  type ProColumns,
} from "@ant-design/pro-components";
import { Form, Modal } from "antd";

const columns: ProColumns[] = [
  {
    title: "学号",
    dataIndex: "studentId",
    search: false,
  },
  {
    title: "姓名",
    dataIndex: "username",
  },
  {
    title: "身份",
    dataIndex: "type",
    valueEnum: studentEnum,
  },
  {
    title: "学校",
    key: "school",
    dataIndex: "school",
    valueEnum: UNIVERSITIES,
    search: false,
  },
  {
    title: "年级",
    dataIndex: "class",
    search: false,
  },
  {
    title: "成绩",
    dataIndex: "score",
    search: false,
  },
  {
    title: "电话",
    dataIndex: "phone",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "注册时间",
    search: false,
    dataIndex: "createdAt",
    valueType: "dateTime",
  },
];

const studentViewColumns: ProDescriptionsItemProps[] = [
  ...(columns as any),
  {
    title: "年龄",
    dataIndex: "age",
  },
  {
    title: "成绩",
    dataIndex: "score",
  },
  {
    title: "地址",
    dataIndex: "address",
    span: 2,
  },
];


export default function Page() {

  const [form] = Form.useForm();

  return (
    <ExTable
      form={form}
      columns={columns}
      viewColumns={studentViewColumns}
      apiUrl={"/api/user"}
      title={"学生列表"}
      params={{ role: ROLE.STUDENT }}
      optionRender={(record, onClick) => [
        <a key="edit" onClick={() => onClick(ModalType.editor)}>
          编辑
        </a>,
        <a key="detail" onClick={() => onClick(ModalType.detail)}>
          详情
        </a>,
      ]}
      onModalChange={(open, selectItem) => {
        form.resetFields();
        if (open && selectItem) {
          form.setFieldsValue(selectItem);
        }
      }}
    >
      {(record, modalProps, { onOk, type }) => {
        return (
          <Modal
            {...modalProps}
            title={type === ModalType.detail ?  "学生详情" : "身份编辑"}
            width={600}
            onOk={() =>
              onOk(async (values) => {
                await request("/api/user", {
                  method: "PUT",
                  data: { ...values, id: record.id },
                });
              })
            }
            footer={(dom) => (type === ModalType.detail ? false : dom)}
          >
            {type === ModalType.editor ? (
              <BetaSchemaForm
                layout="horizontal"
                form={form}
                columns={[
                  {
                    title: "姓名",
                    dataIndex: "username",
                    readonly: true,
                  },
                  {
                    title: "身份",
                    dataIndex: "type",
                    valueType: "radio",
                    fieldProps: {
                      options: studentOptions,
                    },
                    formItemProps: {
                      rules: [
                        {
                          required: true,
                          message: "此项为必填项",
                        },
                      ],
                    },
                  },
                ]}
                submitter={false}
              />
            ) : (
              <ProDescriptions
                columns={studentViewColumns || (columns as any)}
                dataSource={record}
                column={2}
              ></ProDescriptions>
            )}
          </Modal>
        );
      }}
    </ExTable>
  );
}

export {studentViewColumns}
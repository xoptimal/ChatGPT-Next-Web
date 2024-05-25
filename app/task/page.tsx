"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import { ROLE, taskEnum } from "@/app/utils/dic";
import {
  BetaSchemaForm,
  ProColumns,
  ProFormColumnsType,
} from "@ant-design/pro-components";
import { Form, Modal } from "antd";
import request from "../utils/api";

export default function Page() {
  const [form] = Form.useForm();

  const onSearch = async (params: any) => {
    const { data } = await request("/api/user", { params });
    return data.list.map((item: any) => ({
      label: item.username,
      value: item.id,
    }));
  };

  const columns: ProColumns[] = [
    {
      title: "标题",
      dataIndex: "title",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "顾问",
      dataIndex: "counselorId",
      render: (dom, record) => record.counselor?.username,
      valueType: "select",
      fieldProps: {
        showSearch: true,
      },
      request: async (params: { keyWords: string }) =>
        onSearch({ role: ROLE.COUNSELOR, username: params.keyWords }),
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "学生",
      dataIndex: "userId",
      valueType: "select",
      fieldProps: {
        showSearch: true,
      },
      request: async (params: { keyWords: string }) =>
        onSearch({ role: ROLE.STUDENT, username: params.keyWords }),
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      render: (dom, record) => record.user?.username,
    },
    {
      title: "状态",
      valueEnum: taskEnum,
      dataIndex: "status",
      search: false,
      hideInForm: true,
    },
    {
      title: "描述",
      dataIndex: "remark",
      valueType: "textarea",
      search: false,
    },
    {
      title: "创建时间",
      search: false,
      dataIndex: "createdAt",
      valueType: "dateTime",
      hideInForm: true,
    },
  ];

  return (
    <ExTable
      form={form}
      columns={columns}
      apiUrl={"/api/task"}
      title={"任务列表"}
      showCreateButton
      showDetailAction={false}
      optionRender={(record, onClick, doms) => doms}
    >
      {(record, modalProps, { type, onOk }) => {
        const tempModalProps: any = {};
        if (type === ModalType.create) {
          tempModalProps.title = "新建任务";
        } else {
          tempModalProps.title = "编辑任务";
        }

        return (
          <Modal
            {...modalProps}
            {...tempModalProps}
            width={600}
            onOk={() =>
              onOk(async (values) => {
                if (type === ModalType.create) {
                  await request("/api/task", { method: "POST", data: values });
                } else if (type === ModalType.editor) {
                  await request("/api/task", {
                    method: "PUT",
                    data: { id: record.id, ...values },
                  });
                }
              })
            }
          >
            {type === ModalType.create || type === ModalType.editor ? (
              <BetaSchemaForm
                form={form}
                columns={columns as ProFormColumnsType[]}
                submitter={false}
              />
            ) : (
              <span></span>
            )}
          </Modal>
        );
      }}
    </ExTable>
  );
}

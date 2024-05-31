"use client";

import ExTable from "@/app/components/ExTable";
import request from "@/app/utils/api";
import { scheduleStatusType } from "@/app/utils/dic";
import dayjs from "@/lib/dayjs";
import {
  BetaSchemaForm,
  ProColumns,
  ProFormColumnsType,
} from "@ant-design/pro-components";
import { Form, Modal } from "antd";

export default function Page() {
  const [form] = Form.useForm();

  const columns: ProColumns[] = [
    {
      title: "开始时间",
      dataIndex: "startTime",
      valueType: "dateTime",
      fieldProps: {
        format: "YYYY-MM-DD HH:mm",
      },
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      valueType: "dateTime",
      fieldProps: {
        format: "YYYY-MM-DD HH:mm",
      },
    },
    // {
    //   title: "顾问",
    //   dataIndex: "counselorId",
    //   render: (dom, record) => record.counselor.username
    // },
    {
      title: "学生",
      dataIndex: "studentId",
      render: (dom, record) => record.user?.username || "-",
    },
    // {
    //   title: "学生就位",
    //   dataIndex: "userReady",
    //   valueEnum: scheduleReadyType,
    // },
    // {
    //   title: "顾问就位",
    //   dataIndex: "counselorReady",
    //   valueEnum: scheduleReadyType,
    // },
    {
      title: "状态",
      valueEnum: scheduleStatusType,
      dataIndex: "status",
      search: false,
    },
    {
      title: "创建时间",
      search: false,
      dataIndex: "createdAt",
      valueType: "dateTime",
    },
  ];

  const formColumns: ProFormColumnsType[] = [
    {
      valueType: "formList",
      dataIndex: "list",
      fieldProps: {
        //copyIconProps: false,
        creatorButtonProps: {
          creatorButtonText: "添加预约时间",
        },
      },
      initialValue: [{}],
      colProps: {
        xs: 24,
        sm: 12,
      },
      columns: [
        {
          valueType: "group",
          columns: [
            {
              valueType: "dateTime",
              dataIndex: "startTime",
              title: "开始时间",
              fieldProps: {
                placeholder: "请选择开始时间",
                format: "YYYY-MM-DD HH:mm",
                showToday: true,
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
            {
              valueType: "dateTime",
              dataIndex: "endTime",
              title: "结束时间",
              fieldProps: {
                placeholder: "请选择结束时间",
                format: "YYYY-MM-DD HH:mm",
                showToday: true,
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
          ],
        },
      ],
    },
  ];

  return (
    <ExTable
      form={form}
      columns={columns}
      apiUrl={"/api/schedule"}
      title={"预约管理"}
      showCreateButton
      showDetailAction={false}
      addButtonText="提供预约时间"
    >
      {(record, modalProps, { onOk }) => {
        return (
          <Modal
            {...modalProps}
            onOk={() =>
              onOk(async (values) => {
                const { list } = values;
                await request("/api/schedule", {
                  method: "POST",
                  data: list.map((item: any) => ({
                    startTime: dayjs(item.startTime).startOf("hour").toDate(),
                    endTime: dayjs(item.endTime).startOf("hour").toDate(),
                  })),
                });
              })
            }
            width={600}
            title="提供预约时间"
          >
            <BetaSchemaForm
              form={form}
              columns={formColumns}
              submitter={false}
            />
          </Modal>
        );
      }}
    </ExTable>
  );
}

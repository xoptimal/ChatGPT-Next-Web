"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import request from "@/app/utils/api";
import { scheduleStatusType } from "@/app/utils/dic";
import { ProColumns, ProDescriptions } from "@ant-design/pro-components";
import { Empty, Form, Modal } from "antd";

import AdminAuditContent from "@/app/components/AdminAuditContent";
import { useState } from "react";
import { PreviewPsqList } from "../../psq/page";
import { studentViewColumns } from "../../users/guest/student/page";

const auditOptions = [
  { label: "通过", value: 1 },
  { label: "驳回", value: 6 },
];
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
      search: false,
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      valueType: "dateTime",
      fieldProps: {
        format: "YYYY-MM-DD HH:mm",
      },
      search: false,
    },
    {
      title: "预约顾问",
      dataIndex: "counselorId",
      render: (dom, record) => record.counselor.username,
      search: false,
    },
    {
      title: "学生",
      dataIndex: "studentId",
      render: (dom, record) => record.user?.username || "-",
      search: false,
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

  const [modal, setModal] = useState<any>({
    open: false,
    data: null,
    type: 1,
  });

  const handleAction = async (record: any, type: number) => {
    let data, title;
    if (type === 1) {
      title = "个人档案";
      const res = await request("/api/user/profile", {
        method: "GET",
        params: { userId: record.user.id },
      });
      data = res.data;
    } else {
      title = "问卷预览";
      const res = await request("/api/psq", {
        method: "GET",
        params: { userId: record.user.id },
      });
      data = JSON.parse(res.data.content);
    }

    setModal({
      open: true,
      data,
      title,
      type,
      name: record.user.username,
    });
  };

  return (
    <>
      <ExTable
        form={form}
        columns={columns}
        apiUrl={"/api/schedule"}
        title={"普通客户预约列表"}
        optionRender={(record, onClick) => (
          <a key="edit" onClick={() => onClick(ModalType.detail)}>
            审核详情
          </a>
        )}
      >
        {(record, modalProps, { onOk }) => {
          const temp = {
            ...modalProps,
            title: "审核详情",
            footer: (dom: any) => (record?.status === 5 ? dom : false),
            width: 640,
          };

          return (
            <Modal
              {...temp}
              onOk={() =>
                onOk(async (values) => {
                  const target =
                    record.scheduleAudit[record.scheduleAudit.length - 1];
                  const data = {
                    ...values,
                    scheduleId: record.id,
                    targetId: target.id,
                  };
                  await request("/api/schedule", { method: "PUT", data });
                })
              }
            >
              <AdminAuditContent
                record={record}
                form={form}
                showEditor={record?.status === 5}
                auditOptions={auditOptions}
                listKey={"scheduleAudit"}
                name={record?.user?.username}
                renderAction={(item: any) => (
                  <>
                    <a
                      onClick={() =>
                        handleAction({ ...item, user: record.user }, 1)
                      }
                      key="profile"
                    >{`查看档案`}</a>
                    <a
                      onClick={() =>
                        handleAction({ ...item, user: record.user }, 2)
                      }
                      key="psq"
                    >{`查看问卷`}</a>
                  </>
                )}
              >
                {record?.status === 0 && <Empty />}
              </AdminAuditContent>
            </Modal>
          );
        }}
      </ExTable>

      <Modal
        open={modal.open}
        title={modal.title}
        onCancel={() => setModal({ open: false, data: null })}
        footer={null}
      >
        {modal.type === 1 ? (
          <ProDescriptions
            columns={studentViewColumns}
            dataSource={modal.data}
            column={2}
          ></ProDescriptions>
        ) : (
          <PreviewPsqList psqList={modal.data} name={modal.name} />
        )}
      </Modal>
    </>
  );
}

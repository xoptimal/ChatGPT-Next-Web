"use client";
import ExTable from "@/app/components/ExTable";
import PreviewPsqList from "@/app/components/PreviewPsqList";
import { ProColumns } from "@ant-design/pro-components";
import { Modal } from "antd";

 export default function Page() {
  const columns: ProColumns[] = [
    {
      title: "姓名",
      key: "username",
      render: (_, entity) => <span>{entity.user.username}</span>,
    },
    {
      title: "学号",
      key: "studentId",
      render: (_, entity) => <span>{entity.user.studentId}</span>,
    },
    {
      title: "成绩",
      key: "score",
      render: (_, entity) => <span>{entity.user.score}</span>,
    },
    {
      title: "地址",
      key: "address",
      render: (_, entity) => <span>{entity.user.address}</span>,
    },
    // {
    //     title: '问卷',
    //     key: 'content',
    //     search: false,
    //     render: (_, entity) => <a onClick={() => onClickItem(entity)}>预览</a>
    // },
    {
      title: "提交时间",
      search: false,
      dataIndex: "created_at",
      valueType: "dateTime",
    },
  ];
  return (
    <ExTable columns={columns} apiUrl={"/api/psq/list"} title={"问卷管理"}>
      {(record, modalProps) => {
        const psqList = record ? JSON.parse(record.content) : [];
        return (
          <Modal {...modalProps} footer={false} title="问卷预览">
            <PreviewPsqList
              psqList={psqList}
              name={record?.user.username}
            />
          </Modal>
        );
      }}
    </ExTable>
  );
}

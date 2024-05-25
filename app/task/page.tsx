"use client";

import ExTable, { ModalType } from "@/app/components/ExTable";
import request from "@/app/utils/api";
import { counselorLevelOptions, scheduleStatusType } from "@/app/utils/dic";
import { ProColumns } from "@ant-design/pro-components";
import {
  Alert,
  Calendar,
  CalendarProps,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

import { useAsyncEffect } from "ahooks";

import styles from "@/app/service/product/page.module.scss";

import ExUpload from "@/app/components/ExUpload";
import { getImageUrl } from "@/app/utils/helper";

const TextArea = Input.TextArea;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(1);
  const [monthData, setMonthData] = useState();
  const [selectedDay, setSelectDay] = useState(dayjs());
  const [selectedItem, setSelectedItem] = useState<string>();
  const [fileList, setFileList] = useState<any[]>();

  const [form] = Form.useForm();

  const onSubmit = async (
    record: any,
    onSubmitCallback: any,
    type?: number,
  ) => {
    setLoading(true);

    if (type === ModalType.create) {
      try {
        if (!selectedItem) {
          message.warning("请选择预约时间再提交");
          return;
        }

        const arr = selectedItem.split(" ");
        const date = arr[0];
        const times = arr[1].split("-");
        const data = {
          level,
          startTime: `${date} ${times[0]}`,
          endTime: `${date} ${times[1]}`,
        };

        await request("/api/appointment", { method: "POST", data });
        onSubmitCallback();
      } finally {
        setLoading(false);
      }
    } else {
      //  审核详情
      form
        .validateFields()
        .then(async (values) => {
          const data: any = {
            message: values.message,
            scheduleId: record.id,
            status: 5,
          };

          if (fileList) {
            data.attachment = JSON.stringify({
              uid: fileList[0].uid,
              name: fileList[0].name,
            });
          }

          await request("/api/appointment/audit", { method: "POST", data });
          onSubmitCallback();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const columns: ProColumns[] = [
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "顾问",
      dataIndex: "counselorId",
      render: (dom, record) => record.counselor?.username,
    },
    {
      title: "学生",
      dataIndex: "studentId",
      render: (dom, record) => record.user?.username
    },
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

  return (
    <ExTable
      columns={columns}
      apiUrl={"/api/task"}
      title={"任务列表"}
      showCreateButton
      showDetailAction={false}
      // optionRender={(record, onClick) => (
      //   <a key="edit" onClick={() => onClick(ModalType.detail)}>
      //     审核详情
      //   </a>
      // )}
    >
      {(record, modalProps, onSubmitCallback, type) => {

        return (
          <div>123</div>
        )
  }}
    </ExTable>
  );
}

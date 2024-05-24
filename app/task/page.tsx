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
    {
      title: "预约顾问",
      dataIndex: "counselorId",
      render: (dom, record) => record.counselor.username,
    },
    // {
    //   title: "学生",
    //   dataIndex: "studentId",
    //   render: (dom, record) => record.user?.username || '-'
    // },
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

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (monthData) {
      const key = dayjs(current).format("YYYY-MM-DD");

      if (monthData[key]) {
        const options = (monthData[key] as any).map((item: any) => ({
          label: `${item.startTime}-${item.endTime}`,
          value: `${key} ${item.startTime}-${item.endTime}`,
        }));
        return (
          <Radio.Group
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            options={options}
          ></Radio.Group>
        );
      }
    }
    return <span></span>;
  };

  useAsyncEffect(async () => {
    const res = await request("/api/appointment", {
      params: { level, date: selectedDay.toISOString() },
    });
    setMonthData(res.data);
  }, [level]);

  return (
    <ExTable
      columns={columns}
      apiUrl={"/api/schedule"}
      title={"预约管理"}
      showCreateButton
      showDetailAction={false}
      optionRender={(record, onClick) => (
        <a key="edit" onClick={() => onClick(ModalType.detail)}>
          审核详情
        </a>
      )}
    >
    </ExTable>
  );
}

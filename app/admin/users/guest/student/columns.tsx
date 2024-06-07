"use client";
import { UNIVERSITIES, studentEnum } from "@/app/utils/dic";
import {
  ProDescriptionsItemProps,
  type ProColumns,
} from "@ant-design/pro-components";

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

export { columns, studentViewColumns };

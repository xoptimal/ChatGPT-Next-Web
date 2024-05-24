const WEI_XIN_CONTACT = `wxid_tojveiaug3mi22`;

const INVITATION_CODE = "ENDAI-8120512";

enum ROLE {
  STUDENT,
  COUNSELOR,
  CHANNEL,
  PARENT,
  ADMIN = 99,
  STUDENT_PARENT,
}

const UNIVERSITIES = {
  SHJTU: "上海交通大学",
  FUDAN: "复旦大学",
  TONGJI: "同济大学",
  ECNU: "华东师范大学",
  SHU: "上海大学",
  SUFE: "上海财经大学",
  USST: "上海理工大学",
  DHU: "东华大学",
  ECUST: "华东理工大学",
  SMU: "上海海事大学",
};

const ENTITY_TYPE = {
  1: "个体",
  2: "企业",
};

const scheduleStatusType = {
  0: "未预约",
  1: "已预约",
  2: "顾问取消",
  3: "学生取消",
  4: "已过期",
  5: "审核中",
  6: "驳回",
};

const scheduleReadyType = {
  0: "未就位",
  1: "已就位",
};

const counselorLevelOptions = [
  { label: "初级顾问", value: 1 },
  { label: "中级顾问", value: 2 },
  { label: "高级顾问", value: 3 },
];

export {
  WEI_XIN_CONTACT,
  INVITATION_CODE,
  ROLE,
  UNIVERSITIES,
  ENTITY_TYPE,
  scheduleStatusType,
  scheduleReadyType,
  counselorLevelOptions,
};

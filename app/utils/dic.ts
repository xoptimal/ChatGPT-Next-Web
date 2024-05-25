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


const productEnum = {
  1: "初级顾问",
  2: "中级顾问",
  3: "高级顾问",
};

const productStatusEnum = {
  1: {
    text: "通过",
    status: "Success",
  },
  2: {
    status: "Error",
    text: "驳回",
  },
  0: {
    status: "Processing",
    text: "待审核",
  },
};

const taskEnum = {
  2: {
    text: "已完成",
    status: "Success",
  },
  3: {
    status: "Error",
    text: "驳回",
  },
  1: {
    status: "Processing",
    text: "进行中",
  },
  0: {
    status: "Processing",
    text: "待开始",
  },
}

export {
  taskEnum,
  productEnum,
  productStatusEnum,
  
  WEI_XIN_CONTACT,
  INVITATION_CODE,
  ROLE,
  UNIVERSITIES,
  ENTITY_TYPE,
  scheduleStatusType,
  scheduleReadyType,
  counselorLevelOptions,
};

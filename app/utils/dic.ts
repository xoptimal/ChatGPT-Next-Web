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

export function getRole(role: ROLE = ROLE.STUDENT, type: number = 0) {
  let color = "default";
  let name;

  if (role === ROLE.ADMIN) {
    color = "red";
    name = "管理员";
  } else if (role === ROLE.STUDENT) {
    if (type) {
      switch (type) {
        case 2:
          color = "orange";
          name = "VVVIP";
          break;
        case 3:
          color = "volcano";
          name = "加州精英";
          break;
        default:
          name = "普通会员";
          color = "gold";
      }
    } else {
      color = "gold";
      name = "学生";
    }
  } else if (role === ROLE.COUNSELOR) {
    if (type) {
      switch (type) {
        case 2:
          color = "geekblue";
          name = "初级顾问";
          break;
        // case 2:
        //   color = "blue";
        //   name = "中级顾问";
        //   break;
        case 3:
          color = "cyan";
          name = "高级顾问";
          break;
        default:
          color = "purple";
          name = "未认证顾问";
      }
    } else {
      color = "purple";
      name = "顾问";
    }
  } else if (role === ROLE.PARENT) {
    color = "green";
    name = "家长";
  }

  return [color, name];
}


const ENTITY_TYPE = {
  1: "个体",
  2: "企业",
};

const scheduleStatusType = {
  0: {
    text: "未预约",
    status: "default",
  },
  1: {
    text: "已预约",
    status: "success",
  },
  2: {
    text: "顾问取消",
    status: "default",
  },
  3: {
    text: "学生取消",
    status: "default",
  },
  4: {
    text: "已过期",
    status: "default",
  },
  5: {
    text: "审核中",
    status: "processing",
  },
  6: {
    text: "驳回",
    status: "error",
  },
};

const scheduleReadyType = {
  0: "未就位",
  1: "已就位",
};

const counselorLevelToStudentOptions = [
  { label: "初级咨询", value: 2 },
  //{ label: "中级顾问", value: 2 },
  { label: "高级咨询", value: 3 },
];

const counselorLevelOptions = [
  { label: "初级顾问", value: 2 },
  //{ label: "中级顾问", value: 2 },
  { label: "高级顾问", value: 3 },
];

const productEnum = {
  2: "初级顾问",
  //2: "中级顾问",
  3: "高级顾问",
};

const counselorLevelEnum: any = {
  2: {
    text: "初级顾问",
    status: "success",
  },
  // 2: {
  //   text: "中级顾问",
  //   status: "success",
  // },
  3: {
    text: "高级顾问",
    status: "success",
  },
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
  "4": {
    text: "已完成",
    status: "success",
  },
  "3": {
    status: "error",
    text: "驳回",
  },
  "2": {
    status: "processing",
    text: "进行中",
  },
  "1": {
    status: "processing",
    text: "待开始",
  },
};

const subTaskStatus = {
  4: "已完成",
  3: "驳回",
  2: "进行中",
  1: "待开始",
};

const subTaskStatusOptions = [
  { label: "待开始", value: 1 },
  { label: "进行中", value: 2 },
  { label: "已完成", value: 3 },
];

const subTaskDisabledOptions = [
  { label: "可预览", value: 1 },
  { label: "不可预览", value: 2 },
];

const studentEnum = {
  1: "普通会员",
  2: "VVVIP",
  3: "加州精英",
};
const studentOptions = [
  { label: "普通会员", value: 1 },
  { label: "VVVIP", value: 2 },
  { label: "加州精英", value: 3 },
];
enum STUDENT_TYPE {
  INTERMEDIATE = 2,
  ADVANCED = 3,
}

enum COUNSELOR_TYPE {
  INTERMEDIATE = 2,
  ADVANCED = 3,
}

export {
  subTaskDisabledOptions,
  subTaskStatusOptions,
  STUDENT_TYPE,
  COUNSELOR_TYPE,
  counselorLevelToStudentOptions,
  studentEnum,
  studentOptions,
  counselorLevelEnum,
  ENTITY_TYPE,
  INVITATION_CODE,
  ROLE,
  WEI_XIN_CONTACT,
  counselorLevelOptions,
  productEnum,
  productStatusEnum,
  scheduleReadyType,
  scheduleStatusType,
  subTaskStatus,
  taskEnum,
};

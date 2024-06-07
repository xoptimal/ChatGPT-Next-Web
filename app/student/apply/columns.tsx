
const productEnum = {
  1: "VVVIP",
  2: "加州精英服务",
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

const productColumns: any[] = [
  {
    title: "签约产品",
    dataIndex: "type",
    valueEnum: productEnum,
  },
  {
    title: "姓名",
    dataIndex: "username",
  },
  {
    title: "电话",
    dataIndex: "phone",
  },
  {
    title: "金额",
    key: "price",
    dataIndex: "price",
    valueType: "money",
    search: false,
  },
  {
    title: "状态",
    key: "status",
    dataIndex: "status",
    valueEnum: productStatusEnum,
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    valueType: "dateTime",
    search: false,
  },
];

export { productColumns };

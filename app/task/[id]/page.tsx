"use client";

import ExContainer, { ExContainerRef } from "@/app/components/ExContainer";
import request from "@/app/utils/api";
import { ROLE, getRole, subTaskStatus, taskEnum } from "@/app/utils/dic";
import {
  BetaSchemaForm,
  ProCard,
  ProDescriptions,
  ProFormColumnsType,
} from "@ant-design/pro-components";
import {
  Button,
  ButtonProps,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Space,
  Tag,
  message,
} from "antd";
import { useParams } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import ExUpload from "@/app/components/ExUpload";
import {
  formatAttachmentToList,
  formatDate,
  formatDateToFromNow,
  getImageUrl,
  transformAttachment,
} from "@/app/utils/helper";
import { PlusOutlined } from "@ant-design/icons";
import { useAsyncEffect } from "ahooks";
import { useSession } from "next-auth/react";
import styles from "./page.module.scss";

const TaskEnum = taskEnum as Record<string, { text: string; status: string }>;

const formItemProps = {
  rules: [
    {
      required: true,
      message: "此项为必填项",
    },
  ],
};

const rules =  [
  {
    required: true,
    message: "此项为必填项",
  },
]

type SubtaskButtonProps = {
  record?: any;
  task: any;
  onOkCallback: () => void;
  buttonProps?: ButtonProps;
};

type SubtaskButtonRef = {
  open: () => void;
};

const SubtaskButton = forwardRef<
  SubtaskButtonRef,
  React.PropsWithChildren<SubtaskButtonProps>
>((props, ref) => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const { task, record, onOkCallback, buttonProps, children } = props;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (form && record) {
      form.setFieldsValue(record);
    }
  }, [record, open]);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
    },
  }));

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const columns: ProFormColumnsType[] = [
    {
      title: "标题",
      dataIndex: "title",
      formItemProps: {
        // labelCol: {
        //   span: 24,
        // },
        rules,
      },
      // colProps: {
      //   xs: 24,
      //   md: 18,
      // },
    },
    // {
    //   title: "状态",
    //   dataIndex: "status",
    //   valueType: "select",
    //   valueEnum: subTaskStatus,
    //   formItemProps,
    //   hideInForm: !!record,
    //   colProps: {
    //     xs: 24,
    //     md: 6,
    //   },
    // },
    {
      title: "任务描述",
      dataIndex: "remark",
      valueType: "textarea",
      formItemProps,
      // fieldProps: {
      //   autoSize: { minRows: 10 },
      // },
      // colProps: {
      //   xs: 24,
      //   md: 8,
      // },
    },
    {
      title: "任务目标",
      dataIndex: "targetRemark",
      valueType: "textarea",
      formItemProps,
      // colProps: {
      //   xs: 24,
      //   md: 8,
      // },
      // fieldProps: {
      //   autoSize: { minRows: 10 },
      // },
    },
    {
      title: "要求描述",
      dataIndex: "requireRemark",
      valueType: "textarea",
      formItemProps,
      // colProps: {
      //   xs: 24,
      //   md: 8,
      // },
      // fieldProps: {
      //   autoSize: { minRows: 10 },
      // },
    },

    {
      title: "开始时间",
      dataIndex: "startTime",
      valueType: "date",
      colProps: {
        xs: 24,
        md: 24,
      },
      formItemProps,
      width: "md",
    },
    {
      title: "截止时间",
      dataIndex: "endTime",
      valueType: "date",
      colProps: {
        xs: 24,
        md: 24,
      },
      width: "md",
      formItemProps,
    },
    {
      title: "服务记录",
      valueType: "formList",
      dataIndex: "list",
      formItemProps: {
        // @ts-ignore
        creatorButtonProps: {
          creatorButtonText: "添加服务记录",
        },
        copyIconProps: false,
        alwaysShowItemLabel: true,
        itemRender:({ listDom, action }: any, { record }: any) => {
          return (
            <ProCard
              bordered
              extra={action}
              title={record?.name}
              style={{
                marginBlockEnd: 8,
              }}
              size="small"
            >
              {listDom}
            </ProCard>
          );
        }
      },
      hideInForm: !record,
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          formItemProps: {
            // labelCol: {
            //   span: 24,
            // },
            // wrapperCol: {
            //   span: 24,
            // },
            rules: [
              {
                required: true,
                message: "此项为必填项",
              },
            ],
          },
          // colProps: {
          //   span: 4
          // }
        },
        {
          title: "内容",
          dataIndex: "content",
          valueType: 'textarea',
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
          title: "附件",
          key: "attachment",
          dataIndex: "attachment",
          formItemProps: {
            valuePropName: "fileList",
            getValueFromEvent: normFile,
          },
          renderFormItem: (value: any, obj: any, form: any) => {
            return <ExUpload />;
          },
        },
      ],
      // columns: [
      //   {
      //     valueType: "group",
      //     columns: [
      //       {
      //         title: "标题",
      //         dataIndex: "title",
      //         formItemProps: {
      //           rules: [
      //             {
      //               required: true,
      //               message: "此项为必填项",
      //             },
      //           ],
      //         },
      //         // colProps: {
      //         //   span: 4
      //         // }
      //       },
      //       {
      //         title: "内容",
      //         dataIndex: "content",
      //         valueType: 'textarea',
      //         formItemProps: {
      //           rules: [
      //             {
      //               required: true,
      //               message: "此项为必填项",
      //             },
      //           ],
      //         },
            
      //       },
      //       {
      //         title: "附件",
      //         key: "attachment",
      //         dataIndex: "attachment",
      //         formItemProps: {
      //           valuePropName: "fileList",
      //           getValueFromEvent: normFile,
      //         },
      //         renderFormItem: (value: any, obj: any, form: any) => {
      //           return <ExUpload />;
      //         },
      //       },
      //     ],
      //   },
      // ],
    },

    // {
    //   title: "附件",
    //   colProps: {
    //     xs: 24,
    //     sm: 24,
    //   },
    //   renderFormItem: () => (
    //     <ExUpload
    //       fileList={fileList}
    //       onChange={(info: any) => {
    //         setFileList(info.fileList);
    //       }}
    //     />
    //   ),
    // },
  ];

  let title = "添加任务";
  if (record) {
    title = "编辑";
  }

  return (
    <>
      {record ? (
        <a onClick={() => setOpen(true)}>编辑</a>
      ) : (
        <Button type="primary" {...buttonProps} onClick={() => setOpen(true)}>
          {children || title}
        </Button>
      )}
      <Modal
        title={title}
        open={open}
        width={800}
        confirmLoading={confirmLoading}
        onOk={async () => {
          try {
            let { list, ...rest }: any = await form.validateFields();

            list = list?.map((item: any) => ({
              ...item,
              attachment: transformAttachment(item.attachment, false),
            }));
            list = JSON.stringify(list);

            let config;
            if (record) {
              config = {
                method: "PUT",
                data: { id: record.id, list, ...rest },
              };
            } else {
              config = {
                method: "POST",
                data: { taskId: task.id, list, ...rest },
              };
            }

            await request("/api/task/subtask", config);
            onOkCallback?.();
            setOpen(false);
          } catch (e) {
            const error = e as any;
            if (error && error.message) {
              message.error(error.message);
            }
          } finally {
            setConfirmLoading(false);
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <BetaSchemaForm
        layout="horizontal"
          // grid
          // rowProps={{
          //   gutter: [16, 16],
          // }}
          labelCol={{
            span: 3
          }}
          // colProps={{
          //   span: 24,
          // }}
          form={form}
          columns={columns}
          submitter={false}
        ></BetaSchemaForm>
      </Modal>
    </>
  );
});

function MessageButton(
  props: React.PropsWithChildren<{
    record?: any;
    task: any;
    buttonProps?: ButtonProps;
  }>,
) {
  const { record } = props;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const [list, setList] = useState<any[]>([]);

  const containerRef = useRef<ExContainerRef>(null);

  useAsyncEffect(async () => {
    if (open && record) {
      setList([]);
      containerRef.current?.refresh();
    }
  }, [open, record]);

  const [remark, setRemark] = useState("");

  const handleSubmit = async () => {
    if (remark.length === 0) {
      message.warning("说点什么吧!");
      return;
    }

    setConfirmLoading(true);

    try {
      await request("/api/task/subtaskMessage", {
        data: {
          subtaskId: record.id,
          remark,
          attachment: transformAttachment(fileList),
        },
        method: "POST",
      });

      //  刷新列表
      containerRef.current?.refresh();

      //  reset
      setRemark("");
      setFileList([]);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>留言</Button>
      <Drawer
        title={"留言详情"}
        open={open}
        width={600}
        styles={{
          body: {
            padding: 0,
          },
        }}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div className={styles.drawer}>
          <div className={styles.message_list}>
            <ExContainer
              ref={containerRef}
              showEmpty={list.length === 0}
              request={async () => {
                const { data } = await request("/api/task/subtaskMessage", {
                  params: { subtaskId: record.id },
                });
                setList(data.list);
              }}
            >
              {list.map((item) => {
                const attachmentList = formatAttachmentToList(item.attachment);

                const user = item.user;

                const [color, text] = getRole(user.role, user.type);
                return (
                  <div>
                    <Space className={styles.message_title}>
                      <Tag bordered={false} color={color}>
                        {text}
                      </Tag>
                      <h1>{user.username}</h1>
                      <h2>{formatDateToFromNow(item.createdAt)}</h2>
                    </Space>
                    <div className={styles.message_body}>
                      <div className={styles.message_content}>
                        {item.remark}
                      </div>
                      {attachmentList && attachmentList.length > 0 && (
                        <div className={styles.message_attachmentList}>
                          <span>附件:</span>
                          {attachmentList?.map((attachment) => (
                            <a
                              key={attachment.uid}
                              href={getImageUrl(attachment.uid)}
                              target="_blank"
                            >
                              {attachment.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </ExContainer>
          </div>
          <div className={styles.message}>
            <Input.TextArea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <div className={styles.action}>
              <ExUpload
                fileList={fileList}
                onChange={(info: any) => {
                  setFileList(info.fileList);
                }}
              />
              <Button
                type="primary"
                loading={confirmLoading}
                onClick={handleSubmit}
              >
                提交
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export function TaskDetailPage(props: any) {

  const {taskId} = props;

  const [data, setData] = useState<any>();
  const [items, setItems] = useState<any[]>([]);

  const containerRef = useRef<ExContainerRef>(null);

  const handleSubTaskOkCallback = () => {
    containerRef.current?.refresh();
  };

  const { data: session } = useSession();

  const role = session?.user.role;

  const handleTabChange = (
    e: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove",
  ) => {
    if (action === "remove") {
      Modal.confirm({
        title: "删除提示",
        content: `您确认要删除该任务吗?`,
        onOk: () => {
          request("/api/task/subtask", {
            method: "DELETE",
            data: { id: e },
          }).then(() => {
            containerRef.current?.refresh();
          });
        },
      });
    }
  };

  return (
    <ExContainer
      ref={containerRef}
      showEmpty={items.length === 0}
      emptyRender={
        (role === ROLE.COUNSELOR || role === ROLE.ADMIN) && (
          <SubtaskButton onOkCallback={handleSubTaskOkCallback} task={data}>
            添加任务
          </SubtaskButton>
        )
      }
      request={async () => {
        const { data } = await request(`/api/task/${taskId}`);
        setData(data);
        setItems(
          data.subtask.map((item: any) => {
            let temp = { ...item };

            if (temp.list) {
              temp.list = JSON.parse(temp.list).map((child: any) => ({
                ...child,
                attachment: formatAttachmentToList(child.attachment),
              }));
            }

            return temp;
          }),
        );
        // setItems([
        //   { label: "标题", text: data.title },
        //   { label: "顾问", text: data.counselor.username },
        //   { label: "学生", text: data.user.username },
        //   { label: "状态", text: TaskEnum[data.status].text },
        //   { label: "描述", text: data.remark },
        //   { label: "创建时间", text: formatDate(data.createdAt) },
        // ]);
      }}
    >
      {/* <ProCard
        title={
          <Space>
            <span>任务详情</span>
            {data && (
              <Tag color={TaskEnum[data.status].status}>
                {TaskEnum[data.status].text}
              </Tag>
            )}
          </Space>
        }
        headerBordered
      >
        <ProDescriptions>
          {items.map((item, index) => {
            return (
              <ProDescriptions.Item key={index} label={item.label}>
                {item.text}
              </ProDescriptions.Item>
            );
          })}
        </ProDescriptions>
      </ProCard> */}

      {items.length > 0 && (
        <ProCard
          tabs={{
            type:
              role === ROLE.COUNSELOR || role === ROLE.ADMIN
                ? "editable-card"
                : "card",
            onEdit: handleTabChange,
            addIcon: (
              <SubtaskButton
                onOkCallback={handleSubTaskOkCallback}
                task={data}
                buttonProps={{ type: "text" }}
              >
                <PlusOutlined />
              </SubtaskButton>
            ),
          }}
        >
          {items.map((record: any) => (
            <ProCard.TabPane key={record.id} tab={record.title}>
              <div className={styles.tab_content}>
                <div>
                  <h1>任务描述</h1>
                  <h2>{record.remark}</h2>
                </div>

                <div>
                  <h1>任务目标</h1>
                  <h2>{record.targetRemark}</h2>
                </div>

                <div>
                  <h1>要求描述</h1>
                  <h2>{record.requireRemark}</h2>
                </div>

                <div>
                  <h1>时间(完成|执行&截止的时间)</h1>
                  <h2>{`创建时间:${formatDate(record.startTime)}`}</h2>
                  <h2>{`完成时间:${formatDate(record.endTime)}`}</h2>
                </div>

                <div>
                  <h1>服务记录查看/上传</h1>
                  {!record.list ? (
                    <div className={styles.empty}>
                      <Empty />
                    </div>
                  ) : (
                    record.list?.map((child: any, index: number) => (
                      <div key={index} className={styles.history}>
                        <h3>{child.title}</h3>
                        <h3>{child.content}</h3>
                        {child.attachment.length > 0 && (
                          <Space>
                            <span>附件: </span>
                            {child.attachment.map(
                              (attachment: any, attachmentIndex: number) => (
                                <a key={attachmentIndex}>{attachment.name}</a>
                              ),
                            )}
                          </Space>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {(role === ROLE.COUNSELOR || role === ROLE.ADMIN) && (
                  <SubtaskButton
                    onOkCallback={handleSubTaskOkCallback}
                    task={data}
                    record={record}
                  />
                )}

                <div className={styles.tab_footer}>
                  <Space>
                    {(role === ROLE.COUNSELOR || role === ROLE.ADMIN) && (
                      <Button>学生提醒</Button>
                    )}

                    {role === ROLE.ADMIN && <Button>顾问提醒</Button>}

                    {/*  <Button>更新发布</Button> */}
                    <Button>服务内容下载</Button>
                    <MessageButton
                      task={data}
                      record={record}
                      buttonProps={{ type: "link" }}
                    >
                      留言
                    </MessageButton>
                  </Space>
                </div>
              </div>
            </ProCard.TabPane>
          ))}
        </ProCard>
      )}

      {/*   <ProCard
        title={
          <Space>
            <span>任务详情</span>
            {data && (
              <Tag color={TaskEnum[data.status].status}>
                {TaskEnum[data.status].text}
              </Tag>
            )}
          </Space>
        }
        headerBordered
      >
        <ProDescriptions>
          {items.map((item, index) => {
            return (
              <ProDescriptions.Item key={index} label={item.label}>
                {item.text}
              </ProDescriptions.Item>
            );
          })}
        </ProDescriptions>
      </ProCard>

      <ProCard
        style={{ marginTop: 16 }}
        title="任务规划"
        extra={
          data &&
          (data.status === '1' || data.status === '2') &&
          (role === 1 || role === 99) && (
            <SubtaskButton
              buttonProps={{ ghost: true }}
              onOkCallback={handleSubTaskOkCallback}
              task={data}
            ></SubtaskButton>
          )
        }
      >
        {data?.subtask.length === 0 ? (
          <Empty>
            {(role === 1 || role === 99) && (
              <SubtaskButton onOkCallback={handleSubTaskOkCallback} task={data}>
                添加任务
              </SubtaskButton>
            )}
          </Empty>
        ) : (
          <div className={styles.subtask}>
            {data?.subtask.map((item: any) => {
              const attachmentList = formatAttachmentToList(item.attachment);
              return (
                <ProCard
                  ghost
                  key={item.id}
                  title={
                    <div className={styles.title}>
                      <div>
                        {item.title}
                        <Space>
                          <Tag color={TaskEnum[item.status].status}>
                            {TaskEnum[item.status].text}
                          </Tag>
                          <div className={styles.time}>{`开始: ${formatDate(
                            item.startTime,
                          )}`}</div>
                          <div className={styles.time}>{`截止: ${formatDate(
                            item.endTime,
                          )}`}</div>
                        </Space>
                      </div>
                    </div>
                  }
                  headerBordered
                  collapsible
                  defaultCollapsed
                  onCollapse={(collapse) => console.log(collapse)}
                  extra={
                    <Space>
                      {(role === 1 || role === 99) && (
                        <>
                          <SubtaskButton
                            record={item}
                            task={data}
                            onOkCallback={handleSubTaskOkCallback}
                            buttonProps={{ type: "link" }}
                          >
                            编辑
                          </SubtaskButton>
                          <Divider type="vertical" />
                        </>
                      )}

                      {(role === 1 || role === 99) && (
                        <>
                          <DeleteButton
                            delId={item.id}
                            apiUrl={"/api/task/subtask"}
                            onCallback={handleSubTaskOkCallback}
                          />
                          <Divider type="vertical" />
                        </>
                      )}
                      <MessageButton
                        task={data}
                        record={item}
                        buttonProps={{ type: "link" }}
                      >
                        留言
                      </MessageButton>
                    </Space>
                  }
                >
                  <div className={styles.content}>{item.remark}</div>
                  {attachmentList && attachmentList.length > 0 && (
                    <div className={styles.attachment}>
                      <span>附件:</span>
                      <div>
                        {attachmentList?.map((item) => (
                          <a
                            key={item.uid}
                            href={getImageUrl(item.uid)}
                            target="_blank"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </ProCard>
              );
            })}
          </div>
        )}
      </ProCard> */}
    </ExContainer>
  );
}

export default function Page() {
  const { id } = useParams();

  return <>{id && <TaskDetailPage taskId={id} />}</>;
}

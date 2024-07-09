"use client";
import ExContainer, { ExContainerRef } from "@/app/components/ExContainer";
import request from "@/app/utils/api";
import {
  ROLE,
  getRole,
  subTaskDisabledOptions,
  taskEnum,
} from "@/app/utils/dic";
import {
  BetaSchemaForm,
  ProCard,
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
  Radio,
  Space,
  Tag,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";

import ExUpload from "@/app/components/ExUpload";
import { generateDocx } from "@/app/utils/docxHelper";
import {
  formatAttachmentToList,
  formatDate,
  formatDateToFromNow,
  getImageUrl,
  transformAttachment,
} from "@/app/utils/helper";
import {
  CloseOutlined,
  PlusOutlined,
  SmallDashOutlined,
} from "@ant-design/icons";
import { useAsyncEffect } from "ahooks";
import { useSession } from "next-auth/react";
import styles from "./index.module.scss";

const formItemProps = {
  rules: [
    {
      required: true,
      message: "此项为必填项",
    },
  ],
};

const rules = [
  {
    required: true,
    message: "此项为必填项",
  },
];

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ActionButton = (props: any) => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const { task, record, onOkCallback, buttonProps, children } = props;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (form && record) {
      form.setFieldsValue(record);
    }
  }, [open, record]);

  const columns: ProFormColumnsType[] = [
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: taskEnum,
    },
    {
      title: "界面",
      dataIndex: "isDisabled",
      valueType: "segmented",
      fieldProps: {
        options: subTaskDisabledOptions,
      },
    },
  ];

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        操作
      </Button>
      <Modal
        title={"操作"}
        open={open}
        confirmLoading={confirmLoading}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            const config = {
              method: "PUT",
              data: { id: record.id, ...values },
            };
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
          form={form}
          columns={columns}
          submitter={false}
        ></BetaSchemaForm>
      </Modal>
    </>
  );
};

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
              pageContainerProps={{
                pageHeaderRender: false,
                childrenContentStyle: {
                  padding: 0,
                },
              }}
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
                  <div key={item.id} style={{ marginBottom: 16 }}>
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

function TaskContent(props: any) {
  const { taskId } = props;

  const [task, setTask] = useState<any>();
  const [items, setItems] = useState<any[]>([]);

  const containerRef = useRef<ExContainerRef>(null);

  const handleSubTaskOkCallback = () => {
    containerRef.current?.refresh();
  };

  const { data: session } = useSession();

  const role = session?.user.role;

  const handleTabChange = () => {
    Modal.confirm({
      title: "删除提示",
      content: `您确认要删除该任务吗?`,
      onOk: () => {
        request("/api/task/subtask", {
          method: "DELETE",
          data: { id: record.id },
        }).then(() => {
          setActiveIndex(-1);
          containerRef.current?.refresh();
        });
      },
    });
  };



  const [activeIndex, setActiveIndex] = useState(-1);

  const record = items[activeIndex];

  const [form] = Form.useForm<{ name: string; company: string }>();
  const [targetForm] = Form.useForm<{ name: string; company: string }>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [modal, setModal] = useState<any>({
    open: false,
    record: null,
    title: null,
  });

  const [previewIndex, setPreviewIndex] = useState(0);

  const [targetModal, setTargetModal] = useState<any>({
    open: false,
    record: null,
    title: null,
  });

  const onDownload = () => {
    generateDocx(record);
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
      fieldProps: {
        disabled: role === ROLE.STUDENT,
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
      fieldProps: {
        disabled: role === ROLE.STUDENT,
      },
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
      fieldProps: {
        disabled: role === ROLE.STUDENT,
      },
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
      fieldProps: {
        disabled: role === ROLE.STUDENT,
      },
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
      fieldProps: {
        disabled: role === ROLE.STUDENT,
      },
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
      fieldProps: {
        disabled: role === ROLE.STUDENT,
      },
    },
    {
      //title: "服务记录",
      valueType: "formList",
      dataIndex: "list",
      formItemProps: {
        // @ts-ignore
        creatorButtonProps: {
          creatorButtonText: "添加",
        },
        copyIconProps: false,
        alwaysShowItemLabel: true,
        deleteIconProps: {
          Icon: (props: any) => {
            return <CloseOutlined {...props} />;
          },
        },
        itemRender: ({ listDom, action }: any, { record }: any) => {
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
        },
      },
      hideInForm: !record,
      columns: [
        {
          title: "角色",
          dataIndex: "userId",
          hideInForm: true,
        },
        {
          valueType: "dependency",
          name: ["userId"],
          columns: ({ userId }) => {
            return [
              {
                title: "标题",
                dataIndex: "title",
                formItemProps: {
                  rules,
                },
                fieldProps: {
                  disabled: userId && session?.user.userId !== userId,
                },
              },
              {
                title: "内容",
                dataIndex: "content",
                valueType: "textarea",
                formItemProps: {
                  rules,
                },
                fieldProps: {
                  disabled: userId && session?.user.userId !== userId,
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
                  return (
                    <ExUpload
                      uploadProps={{
                        disabled: userId && session?.user.userId !== userId,
                        className: "task-upload",
                      }}
                    />
                  );
                },
              },
            ];
          },
        },
      ],
    },
  ];

  const targetColumns: ProFormColumnsType[] = [
    {
      title: "目标描述",
      dataIndex: "remark",
      valueType: "textarea",
      formItemProps,
      fieldProps: {
        autoSize: { minRows: 20 },
      },
    },
  ];

  return (
    <>
      <ExContainer
        ref={containerRef}
        showEmpty={items.length === 0}
        emptyProps={{
          description:
            role === ROLE.COUNSELOR || role === ROLE.ADMIN
              ? "您还未添加任务, 请尽快添加!"
              : "顾问正在努力计划中, 请稍作等待!",
        }}
        emptyRender={
          (role === ROLE.COUNSELOR || role === ROLE.ADMIN) && (
            <Button
              type="primary"
              onClick={() => {
                setModal({ open: true, data: null, title: "添加任务" });
                form.resetFields();
              }}
            >
              添加任务
            </Button>
          )
        }
        request={async () => {
          const { data } = await request(`/api/task/${taskId}`);
          setTask(data);

          let activeIndex = -1;

          const arr = data.subtask.map((item: any, index: number) => {
            let temp = { ...item };
            if (temp.list) {
              temp.list = JSON.parse(temp.list).map((child: any) => ({
                ...child,
                attachment: formatAttachmentToList(child.attachment),
              }));
            }
            //  初始化第一个可点击对象(Tab)
            if (temp.isDisabled === 1 && activeIndex === -1) {
              activeIndex = index;
            }

            console.log("temp", temp);

            return temp;
          });

          setActiveIndex((prev) => (prev > -1 ? prev : activeIndex));

          // setLabels(
          //   arr.map((item: any, index: number) => ({
          //     label: item.title,
          //     value: index,
          //   })),
          // );
          setItems(arr);
        }}
      >
        <ProCard>
          {previewIndex === 0 ? (
            activeIndex > -1 &&
            record && (
              <div key={record.id} className={styles.tab_content}>
                <div id="task_content">
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
                    <h2>{`创建时间:${formatDate(record.startTime)}`}</h2>
                    <h2>{`完成时间:${formatDate(record.endTime)}`}</h2>
                  </div>

                  {record.list?.map((child: any, index: number) => (
                    <div key={index}>
                      <div className={styles.tab_title}>
                        <Space>
                          <h1>{child.title} </h1>
                           <span>{`| 创建人: ${
                            child.role === ROLE.ADMIN
                              ? "管理员"
                              : child.username
                          }`}</span>
                        </Space>
                      </div>
                      <h2>{child.content}</h2>
                      {child.attachment.length > 0 && (
                        <Space>
                          <span>附件: </span>
                          {child.attachment.map(
                            (attachment: any, attachmentIndex: number) => (
                              <a key={attachmentIndex} target="_blank" href={getImageUrl(attachment.uid)}>{attachment.name}</a>
                            ),
                          )}
                        </Space>
                      )}
                    </div>
                  ))}
                </div>

                {(role === ROLE.ADMIN ||
                  role === ROLE.COUNSELOR ||
                  role === ROLE.STUDENT) && (
                  <a
                    onClick={() => {
                      setModal({ open: true, data: record, title: "编辑" });
                      form.setFieldsValue(record);
                    }}
                  >
                    编辑
                  </a>
                )}

                <div className={styles.tab_footer}>
                  <Space>
                    {(role === ROLE.COUNSELOR || role === ROLE.ADMIN) && (
                      <Button>学生提醒</Button>
                    )}

                    {role === ROLE.ADMIN && <Button>顾问提醒</Button>}

                    {/*  <Button>更新发布</Button> */}
                    <Button onClick={onDownload}>服务内容下载</Button>
                    <MessageButton
                      task={task}
                      record={record}
                      buttonProps={{ type: "link" }}
                    >
                      留言
                    </MessageButton>
                    {(role === ROLE.COUNSELOR || role === ROLE.ADMIN) && (
                      <ActionButton
                        record={record}
                        onOkCallback={handleSubTaskOkCallback}
                      />
                    )}
                  </Space>
                </div>
              </div>
            )
          ) : (
            <div className={styles.targetContent}>
              {task.taskTargetId ? (
                <div>
                  <div className={styles.content}>{task.taskTarget.remark}</div>
                  {role === ROLE.ADMIN ||
                    (role === ROLE.COUNSELOR && (
                      <a
                        onClick={() => {
                          targetForm.setFieldsValue(task.taskTarget);
                          setTargetModal({
                            open: true,
                            data: task.taskTarget,
                            title: "编辑",
                          });
                        }}
                      >
                        编辑
                      </a>
                    ))}
                </div>
              ) : (
                <Empty>
                  {(role === ROLE.ADMIN || role === ROLE.COUNSELOR) && (
                    <Button
                      type="primary"
                      onClick={() => {
                        setTargetModal({
                          open: true,
                          data: null,
                          title: "添加目标",
                        });
                        targetForm.resetFields();
                      }}
                    >
                      添加目标
                    </Button>
                  )}
                </Empty>
              )}
            </div>
          )}
        </ProCard>

        <div
          className={` ${styles.tabs} ${items.length < 10 ? "task-tabs" : ""}`}
        >
          <Radio.Group
            size="large"
            value={activeIndex}
            buttonStyle="solid"
            onChange={(e) => {
              const index = e.target.value;

              if (index === 99) {
                //更多按钮
              } else if (index === 98) {
                //添加任务窗口
                setModal({ open: true, title: "添加任务", data: null });
                form.resetFields();
              } else if (index === 97) {
                //  目标页面
                setPreviewIndex(1);
                setActiveIndex(index);
              } else {
                setActiveIndex(index);
                setPreviewIndex(0);
              }
            }}
          >
            {items.map((item, index) => (
              <Radio.Button
                key={index}
                value={index}
                disabled={
                  role === ROLE.ADMIN || role === ROLE.COUNSELOR
                    ? false
                    : item.isDisabled === 2
                }
              >
                {role === ROLE.ADMIN || role === ROLE.COUNSELOR ? (
                  <Space>
                    {item.title}
                    {index === activeIndex && (
                      <CloseOutlined onClick={handleTabChange} />
                    )}
                  </Space>
                ) : (
                  item.title
                )}
              </Radio.Button>
            ))}
            <Radio.Button key={"more"} value={99} disabled>
              <SmallDashOutlined />
            </Radio.Button>

            {(role === ROLE.ADMIN || role === ROLE.COUNSELOR) && (
              <Radio.Button key={"add"} value={98}>
                <PlusOutlined />
              </Radio.Button>
            )}

            <Radio.Button key={"target"} value={97}>
              目标
            </Radio.Button>
          </Radio.Group>
        </div>
      </ExContainer>

      <Modal
        title={modal.title}
        open={modal.open}
        width={800}
        confirmLoading={confirmLoading}
        onOk={async () => {
          try {
            let { list, ...rest }: any = await form.validateFields();

            list = list?.map((item: any) => {
              let temp: any;

              //  针对没有的, 补充用户信息
              if (!item.userId) {
                temp = {
                  ...item,
                  attachment: transformAttachment(item.attachment, false),
                  userId: session?.user.userId,
                  username: session?.user.username,
                  role: session?.user.role,
                };
              } else {
                temp = {
                  ...item,
                  attachment: transformAttachment(item.attachment, false),
                };
              }

              return temp;
            });
            list = JSON.stringify(list);

            let config;
            if (modal.data) {
              config = {
                method: "PUT",
                data: { id: modal.data.id, list, ...rest },
              };
            } else {
              config = {
                method: "POST",
                data: { taskId: task.id, list, ...rest },
              };
            }

            await request("/api/task/subtask", config);
            handleSubTaskOkCallback();
            setModal({ open: false });
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
          setModal({ open: false });
        }}
      >
        <BetaSchemaForm
          form={form}
          columns={columns}
          submitter={false}
        ></BetaSchemaForm>
      </Modal>

      <Modal
        title={targetModal.title}
        open={targetModal.open}
        width={800}
        confirmLoading={confirmLoading}
        onOk={async () => {
          try {
            const values = await targetForm.validateFields();

            let config;
            if (task.taskTargetId) {
              config = {
                method: "PUT",
                data: { id: task.taskTargetId, ...values },
              };
            } else {
              config = {
                method: "POST",
                data: { taskId: task.id, ...values },
              };
            }

            await request("/api/task/target", config);
            handleSubTaskOkCallback();
            setTargetModal({ open: false });
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
          setTargetModal({ open: false });
        }}
      >
        <BetaSchemaForm
          form={targetForm}
          columns={targetColumns}
          submitter={false}
        ></BetaSchemaForm>
      </Modal>
    </>
  );
}

export { TaskContent };


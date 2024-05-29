"use client";

import ExContainer, { ExContainerRef } from "@/app/components/ExContainer";
import request from "@/app/utils/api";
import { getRole, subTaskStatus, taskEnum } from "@/app/utils/dic";
import {
  BetaSchemaForm,
  ProCard,
  ProDescriptions,
} from "@ant-design/pro-components";
import {
  Button,
  ButtonProps,
  Divider,
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
import { useEffect, useRef, useState } from "react";

import DeleteButton from "@/app/components/DeleteButton";
import ExUpload from "@/app/components/ExUpload";
import {
  formatAttachmentToList,
  formatDate,
  formatDateToFromNow,
  getImageUrl,
  transformAttachment,
} from "@/app/utils/helper";
import { useAsyncEffect } from "ahooks";
import styles from "./page.module.scss";
import { useSession } from "next-auth/react";

const TaskEnum = taskEnum as Record<string, { text: string; status: string }>;

function SubtaskButton(
  props: React.PropsWithChildren<{
    record?: any;
    task: any;
    onOkCallback: () => void;
    buttonProps?: ButtonProps;
  }>,
) {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const { task, record, onOkCallback, buttonProps } = props;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    setFileList([]);
    if (form && record) {
      if (record.attachment) {
        setFileList(formatAttachmentToList(record.attachment));
      }
      form.setFieldsValue(record);
    }
  }, [record, open]);

  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      colProps: {
        xs: 24,
        md: 19,
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "select",
      valueEnum: subTaskStatus,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      colProps: {
        xs: 24,
        md: 5,
      },
    },

    {
      title: "开始时间",
      dataIndex: "startTime",
      valueType: "date",
      colProps: {
        xs: 24,
        md: 12,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      width: "100%",
    },
    {
      title: "截止时间",
      dataIndex: "endTime",
      valueType: "date",
      colProps: {
        xs: 24,
        md: 12,
      },
      width: "100%",
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
      title: "描述",
      dataIndex: "remark",
      valueType: "textarea",
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
      colProps: {
        xs: 24,
        sm: 24,
      },
      renderFormItem: () => (
        <ExUpload
          fileList={fileList}
          onChange={(info: any) => {
            setFileList(info.fileList);
          }}
        />
      ),
    },
  ];

  let title = "新建任务"; 
  if (record) {
    title = "编辑";
  }

  return (
    <>
      {record ? (
        <a onClick={() => setOpen(true)}>编辑</a>
      ) : (
        <Button type="primary" {...buttonProps} onClick={() => setOpen(true)}>
          {title}
        </Button>
      )}
      <Modal
        title={title}
        open={open}
        width={800}
        confirmLoading={confirmLoading}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            setConfirmLoading(true);
            let config: any;
            let attachment = "";
            if (fileList.length) {
              attachment = JSON.stringify(
                fileList.map((item) => ({
                  uid: item.uid,
                  name: item.name,
                })),
              );
            }

            if (record) {
              config = {
                method: "PUT",
                data: { id: record.id, attachment, ...values },
              };
            } else {
              config = {
                method: "POST",
                data: { taskId: task.id, attachment, ...values },
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
          grid
          rowProps={{
            gutter: [16, 16],
          }}
          colProps={{
            span: 24,
          }}
          form={form}
          columns={columns}
          submitter={false}
        ></BetaSchemaForm>
      </Modal>
    </>
  );
}

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
      <a onClick={() => setOpen(true)}>留言</a>
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

                const [color, text] = getRole(user.role, user.type)
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

export default function Page() {
  const { id } = useParams();

  const [data, setData] = useState<any>();
  const [items, setItems] = useState<any[]>([]);

  const containerRef = useRef<ExContainerRef>(null);

  const handleSubTaskOkCallback = () => {
    containerRef.current?.refresh();
  };

  const { data: session } = useSession();

  const role = session?.user.role;

  return (
    <ExContainer
      ref={containerRef}
      request={async () => {
        const { data } = await request(`/api/task/${id}`);
        setData(data);
        setItems([
          { label: "标题", text: data.title },
          { label: "顾问", text: data.counselor.username },
          { label: "学生", text: data.user.username },
          { label: "状态", text: TaskEnum[data.status].text },
          { label: "描述", text: data.remark },
          { label: "创建时间", text: formatDate(data.createdAt) },
        ]);
      }}
    >
      <ProCard
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
          (data.status === 1 || data.status === 2) &&
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
      </ProCard>
    </ExContainer>
  );
}

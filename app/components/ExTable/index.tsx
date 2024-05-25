"use client";
import request from "@/app/utils/api";
import { PlusOutlined } from "@ant-design/icons";
import {
  ActionType,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
  ProTableProps,
  type ProColumns,
} from "@ant-design/pro-components";
import type { ModalProps } from "antd";
import { Button, Modal, message } from "antd";
import { ReactNode, useMemo, useRef, useState } from "react";

type ExTableProps<DataSource, U, ValueType = "text"> = {
  columns: ProColumns[];
  viewColumns?: ProDescriptionsItemProps[];
  apiUrl: string;
  params?: Record<string, any>;
  title?: string;
  modalTitle?: string;
  hideTitle?: boolean;
  showColumnOption?: boolean;
  tableProps?: ProTableProps<DataSource, U, ValueType>;
  showDetailAction?: boolean;
  showDeleteAction?: boolean;
  optionRender?: (
    record: any,
    onClick: (type: number) => void,
    doms: ReactNode[],
  ) => ReactNode | ReactNode[];
  children?: (
    record: any,
    modalProps: any,
    config: {
      type: number;
      onOk: (
        execute: (
          values: any,
          params: { selectItem: any; type: number; onOkCallback: any },
        ) => Promise<any>,
      ) => void;
      onOkCallback: () => void;
    },
  ) => ReactNode;
  modalProps?: ModalProps;
  onSubmit?: (selectItem: any) => void;
  onModalChange?: (open: boolean, selectItem: any, type: number) => void;
  showCreateButton?: boolean;
  form?: any;
};

export enum ModalType {
  create,
  editor,
  detail,
}

export default function ExTable(props: ExTableProps<any, any>) {
  const {
    showDetailAction = true,
    showDeleteAction = true,
    columns,
    viewColumns,
    title,
    modalTitle,
    apiUrl,
    params: customParams,
    tableProps,
    showColumnOption = true,
    optionRender,
    children,
    modalProps,
    onModalChange: onModalChangeProps,
    showCreateButton = false,
    form,
  } = props;

  const [open, setOpen] = useState(false);
  const [selectItem, setSelectItem] = useState<any>(null);

  const [type, setType] = useState<number>(-1);

  const tableColumns: ProColumns[] = useMemo(() => {
    const temp = [...columns];

    if (showColumnOption && (showDetailAction || optionRender)) {
      temp.push({
        title: "操作",
        valueType: "option",
        key: "option",
        render: (text, record, _, action) => {
          const render = [];

          const onClick = (type: number) => {
            setType(type);
            setSelectItem(record);
            onModalChange?.(true, record, type);
            setOpen(true);
          };

          if (optionRender) {
            const doms = [
              <a key="editor" onClick={() => onClick(ModalType.editor)}>
                编辑
              </a>,
            ];
            return optionRender(record, onClick, doms);
          }

          if (showDetailAction) {
            render.push(
              <a key="view" onClick={() => onClick(ModalType.detail)}>
                查看
              </a>,
            );
          }

          //   if (showDeleteAction) {
          //     render.push(
          //       <Popconfirm
          //         key="delete"
          //         title="您确定要删除这条数据吗?"
          //         onConfirm={async () => {
          //           await request("/api/user", {
          //             data: JSON.stringify({ id: record.id }),
          //             method: "DELETE",
          //           });
          //           message.success("删除成功");
          //           action?.reload();
          //         }}
          //         okText="确定"
          //         cancelText="取消"
          //       >
          //         <a>删除</a>
          //       </Popconfirm>,
          //     );
          //   }

          return render;
        },
      });
    }
    return temp;
  }, [showColumnOption]);

  function onModalChange(open: boolean, selectItem: any, type: number) {
    if (onModalChangeProps) {
      onModalChangeProps(open, selectItem, type);
      return;
    }

    if (open) {
      if (selectItem) {
        form?.setFieldsValue(selectItem);
      } else {
        form?.resetFields();
      }
    }
  }

  const onCancel = () => {
    onModalChange?.(false, null, type);
    setOpen(false);
    setSelectItem(null);
  };

  const [confirmLoading, setConfirmLoading] = useState(false);

  async function onOk(
    execute: (
      values: any,
      params: { selectItem: any; type: number; onOkCallback: any },
    ) => Promise<any>,
  ) {
    try {
      let values;
      if (form) {
        values = await form.validateFields();
      }

      setConfirmLoading(true);

      const res = await execute(values, { selectItem, type, onOkCallback });
      if (!res) {
        onOkCallback();
      }
    } catch (e) {
      const error = e as any;
      if (error && error.message) {
        message.error(error.message);
      }
    } finally {
      setConfirmLoading(false);
    }
  }

  const currentModalProps: any = {
    open,
    onCancel,
    title: modalTitle,
    width: 800,
    confirmLoading,
    ...modalProps,
  };

  const actionRef = useRef<ActionType>();

  const onOkCallback = () => {
    //  关闭窗口
    onCancel();
    //  刷新列表
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable
        actionRef={actionRef}
        columns={tableColumns}
        request={async (params, sorter, filter) => {
          const { data, status } = await request(apiUrl, {
            params: { ...params, ...customParams },
            method: "GET",
          });
          return {
            data: data.list,
            total: data.total,
            success: status === 200,
          };
        }}
        search={false}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
        }}
        dateFormatter={"number"}
        options={{
          density: false,
          search: false,
          setting: false,
          fullScreen: true,
        }}
        toolbar={{
          title,
        }}
        toolBarRender={() => {
          const arr = [];

          if (showCreateButton) {
            arr.push(
              <Button
                key="create"
                icon={<PlusOutlined />}
                onClick={() => {
                  setType(ModalType.create);
                  setOpen(true);
                  setSelectItem(null);
                  onModalChange?.(true, null, type);
                }}
                type="primary"
              >
                新建
              </Button>,
            );
          }

          return arr;
        }}
        {...tableProps}
      />

      {children ? (
        children(selectItem, currentModalProps, { type, onOk, onOkCallback })
      ) : (
        <Modal {...currentModalProps} footer={false}>
          <ProDescriptions
            columns={viewColumns || (columns as any)}
            dataSource={selectItem}
            column={2}
          ></ProDescriptions>
        </Modal>
      )}
    </>
  );
}

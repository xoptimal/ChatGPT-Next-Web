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
import { Button, Modal, Popconfirm, message } from "antd";
import { ReactNode, use, useEffect, useMemo, useRef, useState } from "react";

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
  ) => ReactNode | ReactNode[];
  children?: (
    record: any,
    modalProps: any,
    onSubmitCallback: () => void,
    type: number,
  ) => ReactNode;
  modalProps?: ModalProps;
  onSubmit?: (selectItem: any) => void;
  onModalOpen?: (selectItem: any) => void;
  showCreateButton?: boolean;
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
    onModalOpen,
    showCreateButton = false,
  } = props;

  const [open, setOpen] = useState(false);
  const [selectItem, setSelectItem] = useState<any>(null);

  const [type, setType] = useState<number>();

  //   useEffect(() => {

  //   }, [modalTitle])

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
            setSelectItem(record)
            onModalOpen?.(record);
            setOpen(true);
          };

          if (optionRender) {
            return optionRender(record, onClick);
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

  //const [loading, setLoading] = useState(false);

  // const handleOk = async () => {
  //   setLoading(true);
  //   await onSubmit?.(selectItem);
  //   setLoading(false);
  //   setSelectItem(null);
  // };

  const onCancel = () => {
    setOpen(false);
    setSelectItem(null);
  };

  const currentModalProps = {
    open,
    onCancel,
    title: modalTitle,
    width: 800,
    //confirmLoading: loading,
    //onOk: () => handleOk(),
    ...modalProps,
  };

  // if (!onSubmit) {
  //   currentModalProps.footer = false;
  // }

  const actionRef = useRef<ActionType>();

  const onSubmitCallback = () => {
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
        children(selectItem, currentModalProps, onSubmitCallback, type)
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

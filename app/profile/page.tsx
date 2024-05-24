'use client'
import ExTable, { ModalType } from "@/app/components/ExTable";
import request from "@/app/utils/api";
import {UNIVERSITIES} from "@/app/utils/dic";
import {MailOutlined} from "@ant-design/icons";
import {BetaSchemaForm, ProCard, ProForm} from "@ant-design/pro-components";
import {Form, Image, Input, Menu, message, Modal} from "antd";
import React, {useMemo, useState} from "react";
import styles from "@/app/service/product/page.module.scss";
import dayjs from "dayjs";
import ExUpload from "@/app/components/ExUpload";

const TextArea = Input.TextArea;


function StudentView() {

    const columns: any[] = [
        {
            title: '姓名',
            dataIndex: 'username',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            valueType: "digit",
            width: '100%',
        },
        {
            title: '学校',
            key: 'school',
            dataIndex: 'school',
            valueEnum: UNIVERSITIES,
        },
        {
            title: '年级',
            dataIndex: 'class',
        },
        {
            title: '学号',
            dataIndex: 'studentId',
        },
        {
            title: '成绩',
            dataIndex: 'score',
            valueType: "digit",
            width: '100%',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            valueType: "digit",
            width: '100%',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '地址',
            dataIndex: 'address',
            valueType: 'textarea',
            colProps: {span: 24}
        },
    ];

    return <BetaSchemaForm
        style={{width: '800px'}}
        grid
        rowProps={{
            gutter: [16, 16],
        }}
        colProps={{
            span: 12,
        }}
        submitter={{
            searchConfig: {
                submitText: '更新个人信息'
            },
            render: (_, doms) => {
                return [doms[1]];
            },
        }}
        onFinish={async (values) => {
            await request('/api/user/profile', {method: 'PUT', data: values});
            message.success("更新成功")
        }}
        request={() => request('/api/user/profile').then(res => res.data)}
        columns={columns}/>
}

function ParentView() {

    const columns: any[] = [
        {
            title: '姓名',
            dataIndex: 'username',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            valueType: "digit",
            width: '100%',
        },

        {
            title: '电话',
            dataIndex: 'phone',
            valueType: "digit",
            width: '100%',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '职业',
            dataIndex: 'job',
        },
        {
            title: '岗位',
            dataIndex: 'jobName',
        },
    ];

    return <ProForm submitter={{
        searchConfig: {
            submitText: '更新家长信息'
        },
        render: (_, doms) => {
            return [doms[1]];
        },
    }}>
        <ProCard title={"家长1"} bordered={false} headerBordered ghost style={{width: '800px'}}
                 bodyStyle={{marginTop: '16px'}}>
            <BetaSchemaForm
                grid
                rowProps={{
                    gutter: [16, 16],
                }}
                colProps={{
                    span: 8,
                }}
                submitter={false}
                // onFinish={async (values) => {
                //     await request('/api/user/profile', {method: 'PUT', data: values});
                //     message.success("更新成功")
                // }}
                // request={() => request('/api/user/profile').then(res => res.data)}
                columns={columns}/>
        </ProCard>
        <ProCard title={"家长2"} bordered={false} headerBordered ghost style={{width: '800px'}}
                 bodyStyle={{marginTop: '16px'}}>
            <BetaSchemaForm
                grid
                rowProps={{
                    gutter: [16, 16],
                }}
                colProps={{
                    span: 8,
                }}
                submitter={false}
                // onFinish={async (values) => {
                //     await request('/api/user/profile', {method: 'PUT', data: values});
                //     message.success("更新成功")
                // }}
                // request={() => request('/api/user/profile').then(res => res.data)}
                columns={columns}/>
        </ProCard>
    </ProForm>
}

const productEnum = {
    1: 'VVVIP',
    2: '加州精英服务'
}

const productStatusEnum = {
    1: {
        text: '通过',
        status: 'Success',
    },
    2: {
        status: 'Error',
        text: '驳回'
    },
    0: {
        status: 'Processing',
        text: '待审核'
    },
}

const productColumns: any[] = [
    {
        title: '签约产品',
        dataIndex: 'type',
        valueEnum: productEnum
    },
    {
        title: '姓名',
        dataIndex: 'username',
    },
    {
        title: '电话',
        dataIndex: 'phone',
    },
    {
        title: '金额',
        key: 'price',
        dataIndex: 'price',
        valueType: 'money',
        search: false,
    },
    {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        valueEnum: productStatusEnum
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        valueType: 'dateTime',
        search: false,
    },
]

function ProductView() {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>();

    const onSubmit = (record: any, onSubmitCallback: any) => {
        setLoading(true);
        form.validateFields().then(async (values) => {
            const data = {
                message: values.message,
                productId: record.id,
                attachment: imageUrl,
                status: 0,
            };
            await request("/api/productAudit", {method: "POST", data});
            onSubmitCallback();
        }).finally(() => {
            setLoading(false)
        });
    };

    return <ExTable hideTitle
                    modalTitle={"审核详情"}
                    optionRender={(record, onClick) => (
                        <a key="edit" onClick={() => onClick(ModalType.detail)}>
                            审核详情
                        </a>
                    )}
                    onModalOpen={() => {
                        setImageUrl(null)
                    }}
                    tableProps={{
                        tableRender: (props, dom, domList) => domList.table,
                        search: false,
                    }}
                    columns={productColumns}
                    apiUrl={'/api/product'}>
        {(record, modalProps, onSubmitCallback) => (
            <Modal
                {...modalProps}
                onCancel={() => {
                    form.resetFields();
                    modalProps.onCancel();
                }}
                confirmLoading={loading}
                onOk={async () => {
                    await onSubmit(record, onSubmitCallback);
                }}
                footer={(dom) => (record?.status === 2 ? dom : false)}
            >
                <div className={styles.modal_body}>
                    <div className={styles.modal_body_list}>
                        {record?.productAudit.map((item: any, index: number) => (
                            <div>
                                <div key={index}>
                                    <div>
                                        <h1>您</h1>
                                        <span>
                        {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                      </span>
                                    </div>
                                    <div>{item.message}</div>
                                    {
                                        item.attachment && (
                                            <div>
                                                <Image
                                                    className={styles.attachment}
                                                    src={item.attachment}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                                {item.auditMessage && (
                                    <div key={index} className={styles.admin}>
                                        <div>
                                        <h1>系统管理员</h1>
                                            <span>
                          {dayjs(item.updatedAt).format("YYYY-MM-DD HH:mm")}
                        </span>
                                        </div>
                                        <div>{item.auditMessage}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {record?.status === 2 && (
                        <Form form={form} labelCol={{span: 2}} style={{marginTop: '16px'}}>
                            <Form.Item
                                name={"message"}
                                label="说明"
                                rules={[{required: true, message: "请说明"}]}
                            >
                                <TextArea/>
                            </Form.Item>
                            <Form.Item label="附件">
                                <ExUpload imageClassName={styles.icon_attachment} imageUrl={imageUrl} setImageUrl={setImageUrl}/>
                            </Form.Item>
                        </Form>
                    )}
                </div>
            </Modal>
        )}
    </ExTable>
}


export default function Page() {

    const [activeKey, setActiveKey] = useState('product')

    const [title, content] = useMemo(() => {

        switch (activeKey) {
            case 'student':
                return ['个人信息', <StudentView/>]
            case 'product':
                return ['我的签约', <ProductView/>]
            default:
                return ['家长信息', <ParentView/>]
        }
    }, [activeKey])

    return <ProCard split="vertical">
        <ProCard colSpan="200px" ghost>
            <Menu
                mode={'inline'}
                style={{
                    padding: '4px'
                }}
                selectedKeys={[activeKey]}
                onClick={({key}) => setActiveKey(key)}
                items={[
                    {
                        key: 'student',
                        label: '个人信息',
                        icon: <MailOutlined/>,
                    },
                    {
                        key: 'parent',
                        label: '家长信息',
                        icon: <MailOutlined/>,
                    },
                    {
                        key: 'product',
                        label: '我的签约',
                        icon: <MailOutlined/>,
                    }
                ]}></Menu>
        </ProCard>
        <ProCard title={title} bodyStyle={{minHeight: 'calc(100vh - 200px)'}}>
            {content}
        </ProCard>
    </ProCard>
}

export {productColumns}
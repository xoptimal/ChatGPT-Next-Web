'use client'

import {
    CheckCard, ProFormDependency, ProFormDigit,
    ProFormDigitRange,
    ProFormInstance,
    ProFormSelect,
    ProFormText,
    StepsForm
} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import React, {useRef, useState} from 'react';
import {ClusterOutlined, SolutionOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {ENTITY_TYPE, ROLE} from "@/app/utils/dic";


const universities = [
    {"label": "上海交通大学", "value": "SHJTU"},
    {"label": "复旦大学", "value": "FUDAN"},
    {"label": "同济大学", "value": "TONGJI"},
    {"label": "华东师范大学", "value": "ECNU"},
    {"label": "上海大学", "value": "SHU"},
    {"label": "上海财经大学", "value": "SUFE"},
    {"label": "上海理工大学", "value": "USST"},
    {"label": "东华大学", "value": "DHU"},
    {"label": "华东理工大学", "value": "ECUST"},
    {"label": "上海海事大学", "value": "SMU"}
]

const roleOptions = [
    {
        title: '学生',
        value: ROLE.STUDENT,
        avatar: (
            <UserOutlined/>
        ),
    },
    {
        title: '顾问',
        value: ROLE.COUNSELOR,
        avatar: (
            <SolutionOutlined/>
        ),
    },
    {
        title: '渠道',
        value: ROLE.CHANNEL,
        avatar: (
            <ClusterOutlined/>
        ),
    }
]

export default function Register(props: any) {

    const {setType, onFinish} = props

    const formRef = useRef<ProFormInstance>();
    const infoForm = useRef<ProFormInstance>();

    const [role, setRole] = useState(-1)

    return (
        <StepsForm<{}>
            formRef={formRef}
            onFinish={onFinish}
            formProps={{
                validateMessages: {
                    required: '此项为必填项',
                },
            }}
            submitter={{
                render: (props, dom) => {
                    if (props.step === 0) {
                        return (
                            [<Button key={'back'} onClick={() => setType('login')}>返回</Button>, ...dom]
                        );
                    }
                    return dom;
                }
            }}
        >
            <StepsForm.StepForm<{
                name: string;
            }>
                name="role"
                title="选择身份"
                onFinish={async () => {
                    const {role} = formRef.current?.getFieldsValue()
                    setRole(role)
                    infoForm.current?.resetFields();
                    return true;
                }}
            >
                <Form.Item name="role" rules={[{
                    required: true,
                },]}>
                    <CheckCard.Group
                        style={{width: '460px'}}
                        size={"small"}
                        options={roleOptions}
                    >
                    </CheckCard.Group>
                </Form.Item>
            </StepsForm.StepForm>
            <StepsForm.StepForm
                name="info"
                formRef={infoForm}
                title="填写信息"
            >
                {
                    role === ROLE.STUDENT && <>
                        <ProFormText
                            name="username"
                            label={'姓名'}
                            placeholder={'姓名'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入姓名！',
                                },
                            ]}
                        />
                        <ProFormDigit label="年龄" placeholder="年龄" name="age" min={5} max={100} rules={[
                            {
                                required: true,
                                message: '请输入年龄！',
                            },
                        ]}/>

                        <ProFormSelect
                            name="school"
                            options={universities}
                            label={'学校'}
                            placeholder={'学校'}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择所在学校',
                                },
                            ]}
                        />
                        <ProFormText
                            name="class"
                            label={'年级'}
                            placeholder={'年级, 例如:高3二班'}
                            fieldProps={{
                                maxLength: 20
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入年级信息',
                                },
                            ]}
                        />
                        <ProFormText
                            name="phone"
                            label={'电话'}
                            placeholder={'电话'}
                            fieldProps={{
                                maxLength: 20
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入年级信息',
                                },
                            ]}
                        />
                        <ProFormText
                            name="email"
                            label={'邮箱'}
                            placeholder={'邮箱'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入邮箱',
                                },
                                {
                                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    message: '请输入正确的邮箱',
                                },
                            ]}
                        />
                    </>
                }

                {
                    role === ROLE.COUNSELOR && <>
                        <ProFormText
                            name="username"
                            label={'姓名'}
                            placeholder={'姓名'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入姓名！',
                                },
                            ]}
                        />
                        <ProFormText
                            name="phone"
                            label={'电话'}
                            placeholder={'电话'}
                            fieldProps={{
                                maxLength: 20
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入年级信息',
                                },
                            ]}
                        />
                        <ProFormText
                            name="email"
                            label={'邮箱'}
                            placeholder={'邮箱'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入邮箱',
                                },
                                {
                                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    message: '请输入正确的邮箱',
                                },
                            ]}
                        />
                        <ProFormText
                            name="country"
                            label={'国籍'}
                            placeholder={'国籍'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入国籍！',
                                },
                            ]}
                        />
                    </>
                }

                {
                    role === ROLE.CHANNEL && <>

                        <ProFormText
                            name="username"
                            label={'姓名'}
                            placeholder={'姓名'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入姓名！',
                                },
                            ]}
                        />
                        <ProFormText
                            name="phone"
                            label={'电话'}
                            placeholder={'电话'}
                            fieldProps={{
                                maxLength: 20
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入年级信息',
                                },
                            ]}
                        />
                        <ProFormText
                            name="email"
                            label={'邮箱'}
                            placeholder={'邮箱'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入邮箱',
                                },
                                {
                                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    message: '请输入正确的邮箱',
                                },
                            ]}
                        />
                        <ProFormSelect
                            name="entityType"
                            valueEnum={ENTITY_TYPE}
                            label={'类型'}
                            placeholder={'企业 / 个人'}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择企业或者个人',
                                },
                            ]}
                        />
                        <ProFormDependency name={['entityType']}>
                            {({entityType}) => {
                                return (
                                    entityType === 1 && <>
                                        <ProFormText
                                            name="companyName"
                                            label={'企业名称'}
                                            placeholder={'企业名称'}
                                            fieldProps={{
                                                maxLength: 20
                                            }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入企业名称',
                                                },
                                            ]}
                                        />
                                    </>
                                );
                            }}
                        </ProFormDependency>
                        <ProFormText
                            name="address"
                            label={'地址'}
                            placeholder={'地址'}
                            fieldProps={{
                                maxLength: 20
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入地址信息',
                                },
                            ]}
                        />
                    </>
                }
            </StepsForm.StepForm>
            <StepsForm.StepForm
                name="password"
                title="设置密码"
            >
                <ProFormText.Password
                    name="password"
                    placeholder={'密码'}
                    rules={[
                        {
                            required: true,
                            pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,20})/,
                            message: '密码必须以字母数字组成, 6-20个字符',
                            min: 8,
                            max: 20,
                        },
                    ]}
                />
                <ProFormText.Password
                    name="confirmPassword"
                    placeholder={'确认密码'}
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: '请输入确认密码！',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('您输入的密码不匹配'));
                            },
                        }),
                    ]}
                />
            </StepsForm.StepForm>
        </StepsForm>
    );
};
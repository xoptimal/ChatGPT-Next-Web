'use client'

import {LockOutlined, MailOutlined,} from '@ant-design/icons';
import {
    LoginForm,
    ProForm,
    ProFormCaptcha,
    ProFormDependency,
    ProFormSelect,
    ProFormText
} from '@ant-design/pro-components';
import {Form, message, Modal} from 'antd';
import {Suspense, useEffect, useState} from 'react';
import styles from './page.module.scss'
import md5 from 'crypto-js/md5';
import {signIn} from "next-auth/react"
import {useRouter, useSearchParams} from "next/navigation";
import request from "@/app/utils/api";
import handlerError from "@/app/utils/helper";
import {WEI_XIN_CONTACT} from "@/app/utils/dic";


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


function Content() {

    const [type, setType] = useState<'login' | 'register'>('login')

    const router = useRouter()
    const searchParams = useSearchParams()

    const [form] = Form.useForm()

    useEffect(() => {
        form.resetFields();
    }, [type])

    const onFinish = async (values: any) => {

        const {password: originPassword, confirmPassword, ...rest} = values;
        const password = md5(originPassword).toString()
        const data = {...rest, password}

        try {
            if (type === 'register') {
                await request.post('/api/user/register', data)
            }

            const res = await signIn("credentials", {...data, redirect: false})

            if (res?.ok) {
                message.success(res?.error ?? 'succeeded')
                const callbackUrl = searchParams.get('callbackUrl')
                router.replace(callbackUrl ?? '/')
            } else {
                message.error(res?.error)
            }
        } catch (e) {
            handlerError(e)
        }

    }

    return (
        <div className={styles.content}>

            <div className={styles.icon_logo}>
                <img src={'/logo2.png'} alt={""}/>
            </div>

            {
                type === 'register'
                    ? (
                        <div className={styles.container}>

                            <h1>创建您的帐户</h1>

                            <ProForm
                                style={{
                                    width: '328px',
                                }}
                                form={form}
                                size={"large"}
                                submitter={{
                                    searchConfig: {
                                        submitText: '注册',
                                    },
                                    submitButtonProps: {
                                        style: {width: '100%'}
                                    },
                                    render: (props, doms) => doms[1]
                                }}
                                onFinish={onFinish}
                            >
                                <ProFormText
                                    name="email"
                                    placeholder={'邮箱账号'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入邮箱账号',
                                        },
                                        {
                                            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                            message: '请输入正确的邮箱账号',
                                        },
                                    ]}
                                />
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
                                <ProFormText
                                    name="username"
                                    placeholder={'姓名'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入姓名！',
                                        },
                                    ]}
                                />
                                <ProFormSelect
                                    name="school"
                                    options={universities}
                                    placeholder={'所在学校'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择所在学校',
                                        },
                                    ]}
                                />
                                <ProFormSelect
                                    name="role"
                                    options={[
                                        {
                                            value: 1,
                                            label: "学生",
                                        },
                                        {
                                            value: 2,
                                            label: "老师",
                                        },
                                    ]}
                                    placeholder={'学生 / 老师'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择身份, 学生或者老师',
                                        },
                                    ]}
                                />
                                <ProFormDependency name={['role']}>
                                    {({role}) => {
                                        return (
                                            role === 1 && <>
                                                <ProFormText
                                                    name="class"
                                                    placeholder={'班级信息, 例如:高3二班'}
                                                    fieldProps={{
                                                        maxLength: 20
                                                    }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请输入班级信息',
                                                        },
                                                    ]}
                                                />
                                                <ProFormText
                                                    name="studentId"
                                                    placeholder={'学号'}
                                                    fieldProps={{
                                                        maxLength: 20
                                                    }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请输入学号',
                                                        },
                                                    ]}
                                                />
                                            </>
                                        );
                                    }}
                                </ProFormDependency>

                                <ProFormCaptcha
                                    onGetCaptcha={() => {
                                        Modal.info({
                                            title: '验证码获取方式',
                                            centered: true,
                                            content:
                                                <div>添加微信客服<a style={{padding: '0 4px'}}>{WEI_XIN_CONTACT}</a>获取验证码
                                                </div>
                                        });
                                        return Promise.resolve();
                                    }}
                                    countDown={1}
                                    captchaTextRender={() => '获取验证码'}
                                    placeholder={'验证码'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入验证码',
                                        },
                                    ]}
                                    name="code"
                                />

                            </ProForm>

                            <div className={styles.text_register}>已经拥有账号?<a
                                onClick={() => setType('login')}>登录</a>
                            </div>
                        </div>
                    )
                    : (<div className={styles.container}>
                        <LoginForm
                            form={form}
                            title={'欢迎回来'}
                            onFinish={onFinish}
                            actions={<div className={styles.text_register}>没有账号?<a
                                onClick={() => setType('register')}>注册</a>
                            </div>
                            }
                        >
                            <ProFormText
                                name="email"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MailOutlined className={'prefixIcon'}/>,
                                }}
                                placeholder={'邮箱账号'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入邮箱账号!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'}/>,
                                }}
                                placeholder={'密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码！',
                                    },
                                ]}
                            />
                        </LoginForm>
                    </div>)
            }

        </div>
    );
};

export default function Page() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <Content/>
        </Suspense>
    )
}

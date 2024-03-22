'use client'

import {LockOutlined, MailOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormText,} from '@ant-design/pro-components';
import {Form, message} from 'antd';
import {Suspense, useEffect, useState} from 'react';
import styles from './page.module.scss'
import md5 from 'crypto-js/md5';
import {signIn} from "next-auth/react"
import {useRouter, useSearchParams} from "next/navigation";
import request from "@/app/utils/api";
import handlerError from "@/app/utils/helper";

 function Content() {

    const [type, setType] = useState<'login' | 'register'>('login')

    const router = useRouter()
    const searchParams = useSearchParams()

    const passwordFieldProps: any = {
        size: 'large',
        prefix: <LockOutlined className={'prefixIcon'}/>,
    }

    const [form] = Form.useForm()

    useEffect(() => {
        form.resetFields();
    }, [type])

    const onFinish = async (values: any) => {
        const password = md5(values.password).toString()

        const data = {
            email: values.email,
            password: password,
        }

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
                <img src={'/logo-all.png'} alt={""}/>
            </div>

            {
                type === 'register'
                    ? (
                        <div className={styles.container}>
                            <LoginForm
                                form={form}
                                title={'创建您的帐户'}
                                submitter={{
                                    searchConfig: {
                                        submitText: type === 'register' ? '注册' : '登录'
                                    }
                                }}
                                onFinish={onFinish}
                                actions={<div className={styles.text_register}>已经拥有账号?<a
                                    onClick={() => setType('login')}>登录</a>
                                </div>
                                }
                            >
                                <ProFormText
                                    name="email"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <MailOutlined className={'prefixIcon'}/>,
                                    }}
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
                                <ProFormText.Password
                                    name="password"
                                    fieldProps={passwordFieldProps}
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
                                    fieldProps={passwordFieldProps}
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
                            </LoginForm>
                        </div>
                    )
                    : (<div className={styles.container}>
                        <LoginForm
                            form={form}
                            title={'登录'}
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
                                placeholder={'邮箱'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入邮箱!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={passwordFieldProps}
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
            <Content />
        </Suspense>
    )
}

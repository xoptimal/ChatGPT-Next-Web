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
import Register from "@/app/login/components/Register";


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

    const [type, setType] = useState<'login' | 'register'>('register')

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

            <div className={styles.container}>
                <div className={styles.title}>{type === 'register' ? '创建您的帐户' : '欢迎回来'}</div>
                <div className={styles.form}>
                    {
                        type === 'register'
                            ? <Register setType={setType} onFinish={onFinish} />
                            : (
                                <LoginForm
                                    form={form}
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
                                </LoginForm>)
                    }
                </div>

            </div>

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

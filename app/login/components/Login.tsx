"use client";

import Register from "@/app/login/components/Register";
import request from "@/app/utils/api";
import { handlerError } from "@/app/utils/helper";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { Form, message } from "antd";
import md5 from "crypto-js/md5";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Image from 'next/image'

import styles from "./page.module.scss";

export default function Login() {
  const [type, setType] = useState<"login" | "register">("login");

  const router = useRouter();
  const searchParams = useSearchParams();

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [type]);

  const onFinish = async (values: any) => {
    const { password: originPassword, confirmPassword, ...rest } = values;
    const password = md5(originPassword).toString();
    const data = { ...rest, password };

    try {
      if (type === "register") {
        await request.post("/api/user/register", data);
      }

      const res = await signIn("credentials", { ...data, redirect: false });

      if (res?.ok) {
        message.success(res?.error ?? "succeeded");
        const callbackUrl = searchParams.get("callbackUrl");
        router.replace(callbackUrl ?? "/");
      } else {
        message.error(res?.error);
      }
    } catch (e) {
      handlerError(e);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.icon_logo}>
        <Image width={100} height={0} src={"/logo2.png"} alt={""} />
      </div>

      <div className={styles.container}>
        <div className={styles.title}>
          {type === "register" ? "创建您的帐户" : "欢迎回来"}
        </div>
        <div className={styles.form}>
          {type === "register" ? (
            <Register setType={setType} onFinish={onFinish} />
          ) : (
            <LoginForm
              form={form}
              onFinish={onFinish}
              actions={
                <div className={styles.text_register}>
                  没有账号?<a onClick={() => setType("register")}>注册</a>
                </div>
              }
            >
              <ProFormText
                name="email"
                fieldProps={{
                  size: "large",
                  prefix: <MailOutlined className={"prefixIcon"} />,
                }}
                placeholder={"邮箱账号"}
                rules={[
                  {
                    required: true,
                    message: "请输入邮箱账号!",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={"prefixIcon"} />,
                }}
                placeholder={"密码"}
                rules={[
                  {
                    required: true,
                    message: "请输入密码！",
                  },
                ]}
              />
            </LoginForm>
          )}
        </div>
      </div>
    </div>
  );
}

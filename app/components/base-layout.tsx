"use client";

import Image from "next/image";
import React from "react";
import "../global.scss";

import AuthProvider from "@/providers/auth-provider";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Avatar, Button, Dropdown, MenuProps, Space } from "antd";
import type { Metadata } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./base-layout.module.scss";

function Container({
  children,
  hideHeader,
}: {
  children: React.ReactNode;
  hideHeader?: boolean;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGoHome = () => {
    router.replace("/");
  };

  const items: MenuProps["items"] = [
    {
      key: "signOut",
      label: "退出登录",
      icon: <LogoutOutlined />,
    },
  ];

  const onClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "signOut") {
      await signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/login`,
      });
    }
  };

  const renderAppellation = () => {
    if (session?.user.role === 1) {
      return "同学";
    }
    if (session?.user.role === 2) {
      return "老师";
    }
  };

  return (
    <div className={styles.container}>
      {!hideHeader && (
        <div className={styles.header}>
          <div>
            <Image
              onClick={handleGoHome}
              className={styles.icon_logo}
              src={"/logo2.png"}
              width={100}
              height={0}
              alt={""}
            />
          </div>
          {session && (
            <div>
              <Dropdown menu={{ items, onClick }}>
                <Button type={"text"} size={"large"}>
                  <Space>
                    <Avatar
                      size={24}
                      style={{ backgroundColor: "#1677ff" }}
                      icon={<UserOutlined />}
                    />
                    <span style={{ color: "#666" }}>
                      {session.user.username}
                    </span>
                  </Space>
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "恩代 | Education",
  appleWebApp: {
    title: "恩代 | Education",
    statusBarStyle: "default",
  },
};

export default function BaseLayout(props: any) {
  return (
    <html lang="en">
      <head>
        <title>恩代 | Education</title>
        <link rel="shortuct icon" href="/favicon.ico" />
        {props.head}
      </head>
      <body>
        <AntdRegistry>
          <AuthProvider>
            {props.hideContainer ? (
              props.children
            ) : (
              <Container hideHeader={props.hideHeader}>
                {props.children}
              </Container>
            )}
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

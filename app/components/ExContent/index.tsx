"use client";
import { ROLE } from "@/app/utils/dic";
import { getMenus } from "@/app/utils/menuManage";
import {
  LogoutOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type {
  PageContainerProps,
  ProLayoutProps,
  ProSettings,
} from "@ant-design/pro-components";
import { ProLayout } from "@ant-design/pro-components";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import RoleTag from "../RoleTag";
import ScrollToTopButton from "../ScrollToTopButton";

const settings: ProSettings = {
  fixSiderbar: true,
  layout: "mix",
  splitMenus: true,
};

type ExContentProps = {
  pageContainerProps?: PageContainerProps;
  proLayoutProps?: ProLayoutProps;
};

export function getSideMenus(role: number = -1, other = true) {
  let routes: any[] = [];

  if (role === ROLE.STUDENT) {
    routes = [
      {
        key: "/student/profile",
        icon: <UserOutlined />,
        label: "个人信息",
      },
      // {
      //   key: "/student/parent",
      //   icon: <TeamOutlined />,
      //   label: "家长信息",
      // },
      // {
      //   key: "/student/apply",
      //   icon: <SolutionOutlined />,
      //   label: "我的签约",
      // },
    ];
  } else if (role === ROLE.COUNSELOR) {
    routes = [
      {
        key: "/counselor/profile",
        icon: <UserOutlined />,
        label: "个人信息",
      },
      {
        key: "/counselor/myApply",
        icon: <SolutionOutlined />,
        label: "我的申请",
      },
    ];
  } else if (role === ROLE.PARENT) {
    routes = [
      {
        key: "/parent/profile",
        icon: <UserOutlined />,
        label: "个人信息",
      },
    ];
  }

  if (other) {
    if (routes.length > 0) {
      routes.push({
        type: "divider",
      });
    }

    routes.push({
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    });
  }

  return routes;
}

export default function ExContent(
  props: React.PropsWithChildren<ExContentProps>,
) {
  const { pageContainerProps, proLayoutProps } = props;

  const { data: session } = useSession();
  const router = useRouter();

  const role = session?.user.role;
  const type = session?.user.type;

  const routes = getMenus(role);

  const routeSetting = {
    route: {
      path: "/",
      routes: routes.map((item) => ({
        ...item,
        //icon: <Icon icon={item.icon}></Icon>,
        routes: item.routes?.map((child: any) => ({
          ...child,
          //icon: <Icon icon={child.icon}></Icon>,
        })),
      })),
    },
    location: {
      pathname: "/",
    },
  };

  let pathname = usePathname();

  if (pathname === "/users") {
    pathname = "/users/guest/student";
  }
  if (pathname === "/service") {
    pathname = "/service/product";
  }

  const onChange: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      signOut();
    } else {
      router.push(key);
    }
  };

  const title =
    role === ROLE.ADMIN
      ? "管理端"
      : role === ROLE.COUNSELOR
      ? "顾问端"
      : role === ROLE.PARENT
      ? "家长端"
      : "用户端";

  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
      }}
    >
      <ProLayout
        {...routeSetting}
        onMenuHeaderClick={(e) => {
          router.replace("/");
        }}
        bgLayoutImgList={[
          {
            src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
            left: 85,
            bottom: 100,
            height: "303px",
          },
          {
            src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
            bottom: -68,
            right: -45,
            height: "303px",
          },
          {
            src: "https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png",
            bottom: 0,
            left: 0,
            width: "331px",
          },
        ]}
        location={{
          pathname,
        }}
        menu={{
          type: "group",
        }}
        title={title}
        logo={"/logo.png"}
        avatarProps={{
          size: "small",
          icon: <UserOutlined />,
          style: {
            backgroundColor: "#1890ff",
          },
          title: (
            <Space>
              <span>{session?.user.username}</span>
              {session && <RoleTag role={role} type={type} />}
            </Space>
          ),
          render: (props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: getSideMenus(role),
                  onClick: onChange,
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];

          if (typeof document !== "undefined") {
            // 在这里可以安全地访问 document 对象

            return [
              props.layout !== "side" && document.body.clientWidth > 700 ? (
                <div
                  key="SearchOutlined"
                  aria-hidden
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginInlineEnd: 24,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  {pathname === "/" &&
                    role === ROLE.COUNSELOR &&
                    (!type || type === 1) && (
                      <Button
                        type={"primary"}
                        size="small"
                        onClick={() => router.push("/counselor/apply")}
                      >
                        顾问申请
                      </Button>
                    )}

                  {pathname === "/" &&
                    role === ROLE.STUDENT &&
                    (!type || type === 1) && (
                      <Button
                        type={"primary"}
                        size="small"
                        onClick={() => router.push("/student/product")}
                      >
                        恩代服务
                      </Button>
                    )}

                  {pathname !== "/" && role !== ROLE.PARENT && (
                    <Button size="small" onClick={() => router.replace("/")}>
                      返回
                    </Button>
                  )}
                </div>
              ) : undefined,
            ];
          }
          return [];
        }}
        // menuFooterRender={(props) => {
        //     if (props?.collapsed) return undefined;
        //     return (
        //         <div
        //             style={{
        //                 textAlign: 'center',
        //                 paddingBlockStart: 12,
        //             }}
        //         >
        //             <div>© 2021 Made with love</div>
        //             <div>by Ant Design</div>
        //         </div>
        //     );
        // }}
        //onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => (
          <Link href={item.path || "/guide"}>{dom}</Link>
        )}
        {...settings}
        {...proLayoutProps}
        headerContentRender={() => <span></span>}
      >
        {props.children}
        <ScrollToTopButton />
      </ProLayout>
    </div>
  );
}

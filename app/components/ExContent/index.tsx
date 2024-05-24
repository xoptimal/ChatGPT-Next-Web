"use client";
import ScrollToTopButton from "@/app/components/ScrollToTopButton";
import Icon from "@/app/components/icon";
import { getMenus } from "@/app/utils/menuManage";
import { UserOutlined } from "@ant-design/icons";
import type {
    PageContainerProps,
    ProLayoutProps,
    ProSettings,
} from "@ant-design/pro-components";
import { PageContainer, ProLayout } from "@ant-design/pro-components";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const settings: ProSettings = {
  fixSiderbar: true,
  layout: "mix",
  splitMenus: true,
};

type ExContentProps = {
  pageContainerProps?: PageContainerProps;
  proLayoutProps?: ProLayoutProps;
};
export default (props: React.PropsWithChildren<ExContentProps>) => {
  const { pageContainerProps, proLayoutProps } = props;

  const { data: session } = useSession();

  const role = session?.user.role;

  const routes = getMenus(role);

  const routeSetting = {
    route: {
      path: "/",
      routes: routes.map((item) => ({
        ...item,
        icon: <Icon icon={item.icon}></Icon>,
        routes: item.routes?.map((child: any) => ({
          ...child,
          icon: <Icon icon={child.icon}></Icon>,
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

  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
      }}
    >
      <ProLayout
        {...routeSetting}
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
        avatarProps={{
          size: "small",
          icon: <UserOutlined />,
          style: {
            backgroundColor: "#1890ff",
          },
          title: <div>{session?.user?.username}</div>,
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return [
            props.layout !== "side" && document.body.clientWidth > 1400 ? (
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
                {/* {role === ROLE.COUNSELOR &&
                                    <Button type={'primary'}>
                                        顾问申请
                                    </Button>
                                } */}
                {/* <Input
                                    style={{
                                        borderRadius: 4,
                                        marginInlineEnd: 12,
                                        backgroundColor: 'rgba(57,62,67,1)',
                                        color: '#fff',
                                    }}
                                    prefix={
                                        <SearchOutlined
                                            style={{
                                                color: '#dfdfdf',
                                            }}
                                        />
                                    }
                                    placeholder="搜索方案"
                                    variant="borderless"
                                />
                                <PlusCircleFilled
                                    style={{
                                        color: 'var(--ant-primary-color)',
                                        fontSize: 24,
                                    }}
                                />*/}
              </div>
            ) : undefined,
            /*   <InfoCircleFilled key="InfoCircleFilled"/>,
                           <QuestionCircleFilled key="QuestionCircleFilled"/>,
                           <GithubFilled key="GithubFilled"/>,*/
          ];
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
      >
        <PageContainer
          breadcrumbRender={false}
          title={false}
          pageHeaderRender={false}
          {...pageContainerProps}
        >
          {props.children}
        </PageContainer>

        <ScrollToTopButton />
      </ProLayout>
    </div>
  );
};

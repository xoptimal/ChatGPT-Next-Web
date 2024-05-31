"use client";
import { ProCard } from "@ant-design/pro-components";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";

const SideContainer = (
  props: React.PropsWithChildren<{ title: string; items: any[] }>,
) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ProCard split="vertical">
      <ProCard colSpan="200px" ghost>
        <Menu
          mode={"inline"}
          style={{
            padding: "4px",
          }}
          selectedKeys={[pathname]}
          onClick={({ key }) => {
            router.push(key);
          }}
          items={props.items}
        ></Menu>
      </ProCard>
      <ProCard
        //title={props.title}
        bodyStyle={{ minHeight: "calc(100vh - 200px)" }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {props.children}
        </div>
      </ProCard>
    </ProCard>
  );
};

export default SideContainer;

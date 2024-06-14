"use client";
import ExContainer from "@/app/components/ExContainer";
import { TaskContent } from "@/app/components/TaskContent";
import request from "@/app/utils/api";
import { Radio, Space } from "antd";
import { useEffect, useState } from "react";

export default function Page() {
  const [id, setId] = useState();

  const [childList, setChildList] = useState([]);

  const [activeKey, setActiveKey] = useState();

  async function init(current?: string) {
    const res = await request("/api/task/find", {
      method: "GET",
      params: { userId: current ?? activeKey },
    });
    setId(res.data?.id);
  }

  useEffect(() => {
    if (activeKey) {
      init();
    }
  }, [activeKey]);

  return (
    <ExContainer
      emptyProps={{
        description: childList.length === 0 ?  "你未绑定孩子账号" : "您的小孩还未进行任何预约",
      }}
      showEmpty={!id}
      pageContainerProps={{
        childrenContentStyle: {
          padding: 0,
        },
        title: childList.length > 0 && (
          <Space>
            <span>学生:</span>
            <Radio.Group
              optionType="button"
              value={activeKey}
              options={childList}
              onChange={(e) => {
                setActiveKey(e.target.value);
              }}
            />
          </Space>
        ),
      }}
      request={async () => {
        const { data } = await request("/api/user/parent/child");

        if(data?.length > 0) {
          setChildList(
            data.map((item: any) => ({
              label: item.user.username,
              value: item.userId,
            })),
          );
          setActiveKey(data[0].userId);
          await init(data[0].userId); 
        }
      }}
    >
     <TaskContent taskId={id} />
    </ExContainer>
  );
}

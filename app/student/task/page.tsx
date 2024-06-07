"use client";
import ExContainer from "@/app/components/ExContainer";
import { TaskContent } from "@/app/components/TaskContent";
import request from "@/app/utils/api";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [id, setId] = useState();

  const router = useRouter();

  return (
    <ExContainer
      showEmpty={!id}
      request={async () => {
        const res = await request("/api/task/find");
        setId(res.data?.id);
      }}
      emptyProps={{
        description: "您还未进行任何预约",
      }}
      emptyRender={
        <Button
          type="primary"
          onClick={() => router.replace("/student/appointment")}
        >
          前往预约
        </Button>
      }
    >
      <TaskContent taskId={id} />
    </ExContainer>
  );
}

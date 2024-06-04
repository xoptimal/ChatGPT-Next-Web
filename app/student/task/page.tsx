"use client";
import { TaskDetailPage } from "@/app/task/[id]/page";
import request from "@/app/utils/api";
import { useAsyncEffect } from "ahooks";
import { useState } from "react";

export default function Page() {
  const [id, setId] = useState();

  useAsyncEffect(async () => {
    const res = await request("/api/task/find");
    setId(res.data.id);
  }, []);

  return <>{id && <TaskDetailPage taskId={id} />}</>;
}

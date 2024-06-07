"use client";
import { TaskContent } from "@/app/components/TaskContent";
import request from "@/app/utils/api";
import { useAsyncEffect } from "ahooks";
import { useState } from "react";

export default function Page() {
  const [id, setId] = useState();

  useAsyncEffect(async () => {
    const res = await request("/api/task/find");
    setId(res.data.id);
  }, []);

  return <>{id && <TaskContent taskId={id} />}</>;
}

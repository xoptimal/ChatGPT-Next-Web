"use client";

import { TaskContent } from "@/app/components/TaskContent";
import { useParams } from "next/navigation";


export default function Page() {
  const { id } = useParams();
  return <>{id && <TaskContent taskId={id} />}</>;
}

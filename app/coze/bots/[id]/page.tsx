"use client";


import { useCozeStore } from "@/app/store/coze";

import { Chat } from "@/app/components/coze-chat";

export default function Page() {
  const store = useCozeStore();
  const sessionIndex = store.currentSessionIndex;
  return store.sessions.length > 0 && <Chat key={sessionIndex}></Chat>;
}

"use client";


import { useCozeStore } from "@/app/store/coze";

import { Chat } from "@/app/components/coze-chat";
import {Home} from "@/app/components/home";

export default function Page() {
  const store = useCozeStore();
  const sessionIndex = store.currentSessionIndex;
  return store.sessions.length > 0 && <Home><Chat key={sessionIndex}></Chat></Home>;
}

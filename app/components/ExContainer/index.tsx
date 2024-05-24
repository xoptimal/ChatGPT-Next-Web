"use client";

import request from "@/app/utils/api";
import { useAsyncEffect } from "ahooks";
import { useState } from "react";

type ExContainerProps = {
    request: () => void
}

export default function ExContainer(props: React.PropsWithChildren<ExContainerProps>) {
  const { children, request } = props;

  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    setLoading(true);
    await request();
    setLoading(false);
  }, []);

  return <>{loading ? <span>loading...</span> : children}</>;
}

"use client";

import { useAsyncEffect } from "ahooks";
import React, { useImperativeHandle } from "react";
import { useState } from "react";

type ExContainerProps = {
  request: () => void;
};

type ExContainerRef = {
  refresh: () => void;
};

const ExContainer = React.forwardRef<
  ExContainerRef,
  React.PropsWithChildren<ExContainerProps>
>((props, ref) => {
  const { children, request } = props;

  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    await reRefresh();
  }, []);

  async function reRefresh() {
    setLoading(true);
    await request();
    setLoading(false);
  }

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      await reRefresh();
    },
  }));

  return <>{loading ? <span>loading...</span> : children}</>;
});

export type {ExContainerRef}

export default ExContainer;

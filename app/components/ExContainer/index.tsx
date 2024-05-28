"use client";

import { useAsyncEffect } from "ahooks";
import { Empty } from "antd";
import React, { useImperativeHandle } from "react";
import { useState } from "react";

type ExContainerProps = {
  request: () => void;
  showEmpty?: boolean;
};

type ExContainerRef = {
  refresh: () => void;
};

const ExContainer = React.forwardRef<
  ExContainerRef,
  React.PropsWithChildren<ExContainerProps>
>((props, ref) => {
  const { children, request, showEmpty = false } = props;

  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    setLoading(true);
    await request();
    setLoading(false);
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      await request();
    },
  }));

  return (
    <>
      {loading ? (
        <span>loading...</span>
      ) : showEmpty ? (
        <Empty></Empty>
      ) : (
        children
      )}
    </>
  );
});

export type { ExContainerRef };

export default ExContainer;

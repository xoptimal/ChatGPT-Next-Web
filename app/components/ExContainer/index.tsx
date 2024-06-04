"use client";

import { useAsyncEffect } from "ahooks";
import { Empty, Spin } from "antd";
import React, { useImperativeHandle } from "react";
import { useState } from "react";

import styles from './index.module.scss'

type ExContainerProps = {
  request: () => void;
  showEmpty?: boolean;
  emptyRender?: React.ReactNode
};

type ExContainerRef = {
  refresh: () => void;
};

const ExContainer = React.forwardRef<
  ExContainerRef,
  React.PropsWithChildren<ExContainerProps>
>((props, ref) => {
  const { children, request, showEmpty = false, emptyRender } = props;

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
        <div className={styles.loading}>
           <Spin size="large" />
        </div>
      ) : showEmpty ? (
        <Empty>{emptyRender}</Empty>
      ) : (
        children
      )}
    </>
  );
});

export type { ExContainerRef };

export default ExContainer;

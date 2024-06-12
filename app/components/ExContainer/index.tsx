"use client";

import { useAsyncEffect } from "ahooks";
import { Empty, EmptyProps, Spin } from "antd";
import React, { useImperativeHandle, useState } from "react";

import { PageContainer, PageContainerProps } from "@ant-design/pro-components";
import styles from "./index.module.scss";

type ExContainerProps = {
  request?: () => void;
  showEmpty?: boolean;
  emptyRender?: React.ReactNode;
  emptyProps?: EmptyProps;
  pageContainerProps?: PageContainerProps;
};

type ExContainerRef = {
  refresh: () => void;
};

const ExContainer = React.forwardRef<
  ExContainerRef,
  React.PropsWithChildren<ExContainerProps>
>((props, ref) => {
  const {
    children,
    request,
    showEmpty = false,
    emptyRender,
    emptyProps,
    pageContainerProps,
  } = props;

  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    setLoading(true);
    await request?.();
    setLoading(false);
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      await request?.();
    },
  }));

  let temp: PageContainerProps = {
    breadcrumbRender: false,
  };

  if (!pageContainerProps) {
    (temp.title = false), (temp.pageHeaderRender = false);
  } else {
    temp = {
      ...temp,
      title: false,
      ...pageContainerProps,
    };
  }

  return (
    <PageContainer {...temp}>
      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : showEmpty ? (
        <Empty {...emptyProps}>{emptyRender}</Empty>
      ) : (
        children
      )}
    </PageContainer>
  );
});

export type { ExContainerRef };

ExContainer.displayName = "ExContainer";

export default ExContainer;

"use client";

import { ErrorBoundary } from "../components/error";
import "../styles/globals.scss";
import "../styles/highlight.scss";
import "../styles/markdown.scss";

import BaseLayout from "@/app/components/base-layout";
import dynamic from "next/dynamic";
import {
  HashRouter as Router
} from "react-router-dom";

const ExContent = dynamic(() => import("@/app/components/ExContent"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout hideContainer>
      <ExContent>{children}</ExContent>
    </BaseLayout>
  );
}

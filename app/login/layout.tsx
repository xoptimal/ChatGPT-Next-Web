import BaseLayout from "@/app/components/base-layout";
import type { Metadata } from "next";
import ExContent from "../components/ExContent";

export const metadata: Metadata = {
  title: "恩代 | Education",
  appleWebApp: {
    title: "恩代 | Education",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseLayout hideHeader>
    {children}
    </BaseLayout>;
}

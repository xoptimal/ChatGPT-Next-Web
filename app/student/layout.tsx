"use client";

import BaseLayout from "@/app/components/base-layout";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

const ExContent = dynamic(() => import("@/app/components/ExContent"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  let pageContainerProps;

  if (pathname === "/student/product") {
    pageContainerProps = {
      childrenContentStyle: {
        padding: 0,
        background: "white",
      },
    };
  }

  return (
    <BaseLayout hideContainer>
      <ExContent pageContainerProps={pageContainerProps}>{children}</ExContent>
    </BaseLayout>
  );
}

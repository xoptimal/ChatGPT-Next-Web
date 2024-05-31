"use client";

import BaseLayout from "@/app/components/base-layout";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ExContent = dynamic(() => import("@/app/components/ExContent"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <BaseLayout hideContainer>
      <ExContent>{children}</ExContent>
    </BaseLayout>
  );
}

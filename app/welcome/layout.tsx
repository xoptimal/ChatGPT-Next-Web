import BaseLayout from "@/app/components/base-layout";
import dynamic from "next/dynamic";

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
      <ExContent pageContainerProps={{ 
        childrenContentStyle: {
          padding: 0,
        },
      }}>
        {children}
      </ExContent>
    </BaseLayout>
  );
}

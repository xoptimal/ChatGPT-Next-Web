"use client";

import { Home } from "@/app/components/coze-home";
import { PageContainer } from "@ant-design/pro-components";

export default function Page() {
  
    return (
        <PageContainer title={false}>
            <Home/>
        </PageContainer>
    );
}
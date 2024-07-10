import "../styles/globals.scss";
import "../styles/markdown.scss";
import "../styles/highlight.scss";
import {getClientConfig} from "../config/client";
import React from "react";
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
        <BaseLayout hideContainer head={
            <>
                <meta name="config" content={JSON.stringify(getClientConfig())}/>
                <script src="/serviceWorkerRegister.js" defer></script>
            </>
        }>
            <ExContent>{children}</ExContent>
        </BaseLayout>
    );
}


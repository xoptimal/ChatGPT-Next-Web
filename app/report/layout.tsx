import {AntdRegistry} from "@ant-design/nextjs-registry";
import React from "react";

import '../global.css'

const RootLayout = ({children}: React.PropsWithChildren) => {

    return (
        <html lang="en">
        <body>
        <AntdRegistry>{children}</AntdRegistry>
        </body>
        </html>
    );
};


export default RootLayout;

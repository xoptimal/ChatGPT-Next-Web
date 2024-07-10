"use client";

import { Home } from "@/app/components/coze-home";
import { PageContainer } from "@ant-design/pro-components";

export default function Page() {
  
    return (
        <PageContainer title={false}>
            {/*<div className={styles.container}>*/}
            {/*    {bots.map((item, index) => (*/}
            {/*        <Button*/}
            {/*            size={"large"}*/}
            {/*            key={item.botId}*/}
            {/*            onClick={() => {*/}
            {/*                store.selectSession(index);*/}
            {/*                router.push(`/coze/bot`);*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            {item.name}*/}
            {/*        </Button>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <Home/>
        </PageContainer>
    );
}
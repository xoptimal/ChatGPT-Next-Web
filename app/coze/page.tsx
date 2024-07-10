"use client";

import {PageContainer} from "@ant-design/pro-components";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useCozeStore} from "@/app/store";
import {Home} from "@/app/components/coze-home";

const bots = [
    {
        name: "01环游世界_test",
        botId: "7387603191824908293",
        token:
            "pat_NTnZbBqWysOYXlqrXNhfTCDhkALSezgXv2aRC90S5bdbwidXXh6DKQl0F5M4CdEW",
    },
];

export default function Page() {
    const router = useRouter();
    const store = useCozeStore();

    async function fetchInitialAssistantList() {
        try {
            //cozeBots();

            //  添加到Store
            store.setSessions(bots);
            //  通知
            //props.init(res.assistants.length > 0)
        } catch (e) {
            console.log("e", e);
        }
    }

    useEffect(() => {
        fetchInitialAssistantList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
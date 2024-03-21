'use client'
import UserLayout from "@/app/components/base-layout";
import {Button, Result} from "antd";
import {useRouter} from "next/navigation";

export default function Page() {

    const router = useRouter();
    const handleBackHome = () => {
        router.replace('/')
    }

    return <UserLayout>
        <Result
            status="403"
            title="403"
            style={{marginTop: '100px'}}
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" onClick={handleBackHome}>Back Home</Button>}
        />
    </UserLayout>
}
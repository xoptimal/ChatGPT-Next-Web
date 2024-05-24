'use client'
import {message} from "antd";
import {useRouter} from 'next/navigation'
import {useSession} from "next-auth/react";
import {useState} from "react";
import request from "../utils/api";

import styles from './page.module.scss'
import {useAsyncEffect} from "ahooks";
import {ROLE} from "@/app/utils/dic";
import {NULL} from "sass";

const card = [
    {title: '问答', subTitle: 'QUESTION', key: 'psq', role: 1},
    {title: '指导', subTitle: 'GUIDE', key: 'gpt', role: 0},
    {title: '规划', subTitle: 'PLAN', key: '', role: -1},
    {title: '文书', subTitle: 'BOOK', key: '', role: -1},
    {title: '政策', subTitle: 'POLICY', key: '', role: -1},
    {title: '报告', subTitle: 'REPORT', key: 'report', role: 2},
    {title: '待定1', subTitle: 'Coming soon', key: '', role: -1},
    {title: '待定2', subTitle: 'Coming soon', key: '', role: -1},
    {title: '待定3', subTitle: 'Coming soon', key: '', role: -1},
    {title: '待定4', subTitle: 'Coming soon', key: '', role: -1},
]

const roleCard = {
    [ROLE.STUDENT] : [
        {title: '预约咨询', subTitle: 'reserve', key: 'psq', },
        {title: '任务中心', subTitle: 'task', key: 'gpt', },
        {title: '信息中心', subTitle: 'information', key: '', },
        {title: '产品中心', subTitle: 'service', key: '', },
        {title: 'GPT', subTitle: 'GPT', key: 'gpt', },
    ],
    [ROLE.PARENT] : [
        {title: '查看孩子进度', subTitle: 'reserve', key: 'psq', },
        {title: '产品中心', subTitle: 'service', key: '', },
    ],
    [ROLE.COUNSELOR] : [
        {title: '顾问申请', subTitle: 'reserve', key: 'psq', },
        {title: '管理日程', subTitle: 'service', key: '', },
        {title: '信息中心', subTitle: 'service', key: '', },
        {title: 'GPT', subTitle: 'GPT', key: 'gpt', },
    ],
    [ROLE.CHANNEL] : [
        {title: '加入我们', subTitle: 'reserve', key: 'psq', },
        {title: '个人信息', subTitle: 'reserve', key: 'psq', },
    ],
    [ROLE.ADMIN] : [
        {title: '用户管理', subTitle: 'reserve', key: 'users', },
        {title: '服务管理', subTitle: 'reserve', key: 'services', },
        {title: '数据管理', subTitle: 'reserve', key: 'data', },
    ]
}


export default function Guide() {
    const router = useRouter()

    const {data: session} = useSession()

    const [exist, setExist] = useState(false)

    useAsyncEffect(async () => {
        if (session) {
            const res = await request('/api/psq/check')
            setExist(res.data)
        }
    }, [session])


    async function gotoPage(item: any) {
        const {key: path} = item
        if (path) {
            router.push(`/${path}`)
        } else {
            await message.warning("Coming soon")
        }
    }

    return <div className={styles.container}>
        <div className={styles.content}>
            {session && session?.user.role !== null &&
                // @ts-ignore
                roleCard[session?.user.role].map((item, index) =>
                    <div key={index} onClick={() => gotoPage(item)} className={styles.item}>
                        <div>
                            <h1>{item.title}</h1>
                            <h2>{item.subTitle}</h2>
                        </div>
                    </div>)
            }
        </div>
    </div>
}

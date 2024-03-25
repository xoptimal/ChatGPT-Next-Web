'use client'
import {message} from "antd";
import {useRouter} from 'next/navigation'
import {useSession} from "next-auth/react";
import {useState} from "react";
import request from "../utils/api";

import styles from './page.module.scss'
import {useAsyncEffect} from "ahooks";

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
        const {key, role} = item

        let path;

        if (role === -1 || role === 0) {
            if (session?.user.role === 1) {
                if (exist) {
                    path = key
                } else {
                    return
                }
            } else {
                path = key
            }
        } else if (session?.user.role === role) {
            path = key
        }

        if (path) {
            router.push(`/${key}`)
        } else {
            await message.warning("Coming soon")
        }

    }


    const getClassName = (role: number, key: string) => {
        if (role === -1 || role === 0) {
            let className = styles.item

            if (session?.user.role === 1 && !exist) {
                className = styles.disabled;
            }
            return className;
        }

        return session?.user.role === role
            ? styles.item
            : styles.display_none
    }


    return <div className={styles.container}>
        <div className={styles.content}>
            {session && session?.user.role &&
                card.map((item, index) =>
                    <div key={index} onClick={() => gotoPage(item)}
                         className={getClassName(item.role, item.key)}>
                        <div>
                            <h1>{item.title}</h1>
                            <h2>{item.subTitle}</h2>
                        </div>
                    </div>)
            }
        </div>
    </div>
}

'use client'
import {Button, message, Modal} from "antd";
import {useRouter} from 'next/navigation'
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import request from "../utils/api";

import styles from './page.module.scss'
import Log from "@hello-pangea/dnd/src/debug/middleware/log";

export default function Guide() {
    const router = useRouter()

    const {data: session} = useSession()

    const [open, setOpen] = useState(false)

    const [selectIndex, setSelectIndex] = useState(-1);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (session && !session.user.role) {
            setOpen(true)
        }
    }, [session])

    async function gotoPage(item: any) {
        const {key, role} = item
        if (key) {
            if (role === -1 || role === 0 || session?.user.role === role) {
                router.push(`/${key}`)
            }
        } else {
            await message.warning("Coming soon")
        }
    }

    const handleRole = async () => {
        setLoading(true)
        await request.put('/api/user/profile', {role: selectIndex})
        setLoading(false)
        setOpen(false)
        message.success("设定成功")
    }

    const handleMouseEnter = (role: number) => {
        setSelectIndex(role)
    };

    const handleMouseLeave = () => {
        setSelectIndex(-1)
    };

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
    ]

    const getClassName = (role: number) => {
        if (role === -1 || role === 0) {
            return styles.item;
        }
        return session?.user.role === role ? styles.item : styles.disabled
    }

    return <div className={styles.container}>
        <div className={styles.content}>
            {session &&
                card.map((item, index) => (
                    <div key={index} onClick={() => gotoPage(item)} className={getClassName(item.role)}>
                        <div>
                            <h1>{item.title}</h1>
                            <h2>{item.subTitle}</h2>
                        </div>
                    </div>
                ))
            }
        </div>
        <Modal open={open} closable={false} centered
               footer={false}>
            <div className={styles.modal_title}>
                <h1>首次使用, 请选择身份</h1>
                <h2>身份确认后不可更改</h2>
            </div>
            <div className={styles.card}>
                <div onMouseEnter={() => handleMouseEnter(1)}
                     onMouseLeave={handleMouseLeave}
                     className={selectIndex === 1 ? styles.selected : ''}>
                    <h1>学 生</h1>
                    <h2>Student</h2>
                    <Button loading={loading} className={styles.button} size={"large"}
                            onClick={handleRole}>确认</Button>
                </div>
                <div onMouseEnter={() => handleMouseEnter(2)}
                     onMouseLeave={handleMouseLeave}
                     className={selectIndex === 2 ? styles.selected : ''}>
                    <h1>老 师</h1>
                    <h2>Teacher</h2>
                    <Button loading={loading} className={styles.button} size={"large"}
                            onClick={handleRole}>确认</Button>
                </div>
            </div>
        </Modal>
    </div>
}

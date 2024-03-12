'use client'
import {message} from "antd";

import {useRouter} from 'next/navigation'
import styles from './page.module.scss'
import {RightCircleFilled} from "@ant-design/icons";

export default function Guide() {
    const router = useRouter()

    function gotoPage(path?: string) {
        if (path) {
            router.push(path)
        } else {
            message.warning("Coming soon")
        }
    }

    return <div className={styles.container}>
        <div className={styles.content}>
            <div onClick={() => gotoPage('psq')}>
                <h1>问答</h1>
                <h2>QUESTION</h2>
                <div><RightCircleFilled/></div>
            </div>
            <div onClick={() => gotoPage('gpt')}>
                <h1>指导</h1>
                <h2>GUIDE</h2>
                <div><RightCircleFilled/></div>
            </div>
            <div onClick={() => gotoPage()}>
                <h1>规划</h1>
                <h2>PLAN</h2>
                <div><RightCircleFilled/></div>
            </div>
            <div onClick={() => gotoPage()}>
                <h1>文书</h1>
                <h2>BOOK</h2>
                <div><RightCircleFilled/></div>
            </div>
            <div onClick={() => gotoPage()}>
                <h1>政策</h1>
                <h2>POLICY</h2>
                <div><RightCircleFilled/></div>
            </div>
            <div onClick={() => gotoPage('report')}>
                <h1>报告</h1>
                <h2>REPORT</h2>
                <div><RightCircleFilled /></div>
            </div>
        </div>
    </div>
}

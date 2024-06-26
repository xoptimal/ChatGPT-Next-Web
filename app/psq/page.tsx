'use client'
import {useRouter} from 'next/navigation'
import {Button} from "antd";
import Image from "next/image";

import styles from './page.module.scss'

export default function Guide() {
    const router = useRouter()

    const onStart = () => {
        router.push('/psq/form')
    }

    return <div className={styles.container}>
        <Image className={styles.icon_logo} src={"/logo2.png"} width={140} height={0} alt={""}/>
        <h1>参与问卷</h1>
        <h2>准备好就点击下方按钮开始吧!</h2>
        <div>
            <Button type={"primary"} size={"large"} onClick={onStart}>开始</Button>
        </div>
    </div>
}
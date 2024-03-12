'use client'
import {useRouter} from 'next/navigation'
import {Button} from "antd";
import DoneIcon from '@/app/icons/done.svg'

import styles from './page.module.scss'

export default function Guide() {
    const router = useRouter()

    const onBack = () => {
        router.replace('/psq')
    }

    return <div className={styles.container}>
        <DoneIcon/>
        <h1>提交成功, 感谢你的参与!</h1>
        <div>
            <Button size={"large"} onClick={onBack}>返回</Button>
        </div>
    </div>
}
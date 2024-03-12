'use client'
import {useRouter} from 'next/navigation'
import {useEffect} from "react";
import {ProForm, ProFormProps, ProFormText, ProFormTextArea} from "@ant-design/pro-components";
import request from "@/app/utils/api";
import {message} from "antd";

import styles from './page.module.scss'

const question = [
    '你目前的年级是什么？你在哪个年级？',
    '你上的是哪所高中？',
    '你的成绩怎么样？你的成绩如何？',
    '你想追求什么职业？',
    '你想主修什么？',
    '如果你能做任何你想做的事，没有任何限制，你会做什么，为什么？',
    '你有什么兴趣和爱好？你还有其他兴趣/爱好吗？',
    '你喜欢在哪个国家生活？',
    '你想上什么大学？',
    '你打算如何支付大学学费？',
]


export default function Guide() {
    const router = useRouter()

    useEffect(() => {

    }, []);

    const onFinish: ProFormProps["onFinish"] = async (formData) => {

        const {username, phone, ...rest} = formData;

        const arr: { question: string, value: string }[] = [];

        question.forEach((item, index) => {
            arr.push({question: item, value: rest[`question_${index}`]})
        })

        const data = {
            username, phone, content: JSON.stringify(arr)
        }

        await request('/api/psq', {method: 'post', data: data})

        //  跳转结果页
        router.replace('/psq/result')
    }

    return <div className={styles.container}>
        <h1>PSQ</h1>

        <ProForm className={styles.form} onFinish={onFinish} submitter={{
            render: (props, dom) => [[dom[1]]],
            submitButtonProps: {
                style: {width: '100%'}
            }
        }}>
            <ProFormText name={'username'} label={"姓名"}/>
            <ProFormText name={'phone'} label={"联系电话"}/>

            <div>
                {question.map((item, index) => <div key={index}>
                    <ProFormTextArea name={`question_${index}`} label={item} value={"123"}/>
                </div>)}
            </div>
        </ProForm>
    </div>
}
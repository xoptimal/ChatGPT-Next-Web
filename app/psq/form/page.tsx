'use client'
import {useRouter} from 'next/navigation'
import React, {useRef, useState} from "react";
import {Alert, Button, Form, Input, Space, Spin} from "antd";
import styles from './page.module.scss'
import Image from 'next/image'
import UserIcon from '@/app/icons/user.svg'
import RenameIcon from '@/app/icons/rename.svg'
import {ModalForm, ProFormText} from "@ant-design/pro-components";
import request from "@/app/utils/api";
import {useAsyncEffect, useGetState} from "ahooks";
import AnalogInputText from "@/app/components/analog-input-text";

const TextArea = Input.TextArea

export default function FormPage() {

    const router = useRouter()

    const [list, setList, getList] = useGetState<string[]>([])
    const [inputValue, setInputValue] = useState("")
    const [editIndex, setEditIndex] = useState(-1)
    const [editValue, setEditValue] = useState("")
    const [loadingIndex, setLoadingIndex] = useState(-1)
    const [open, setOpen] = useState(false)
    const [form] = Form.useForm()
    const questionIndexRef = useRef(0);
    const questionListRef = useRef([])
    const contentRef = useRef<HTMLDivElement>(null);

    useAsyncEffect(async () => {
        const res = await request('/api/question', {method: 'GET'})
        questionListRef.current = res.data.list.map((item: { content: string }) => item.content)
        setLoadingIndex(0);
        setList([questionListRef.current[0]])
        setTimeout(() => {
            setLoadingIndex(-1)
        }, 500)
    }, [])

    const handleEdit = (index: number, value: string) => {
        setEditIndex(index)
        setEditValue(value)
    }

    const handleEditSave = () => {
        setList(prevState => {
            prevState[editIndex] = editValue
            return [...prevState]
        })
        handleEdit(-1, "")
    }

    const handleSend = () => {
        const list = getList();
        const question = questionListRef.current
        //  添加
        list.push(inputValue)
        setList([...list])
        //  置空
        setInputValue("")

        if (list.length === (question.length * 2)) {
            setTimeout(() => {
                contentRef.current!.scrollTop = contentRef.current!.scrollHeight
            }, 300)
            setTimeout(() => {
                setOpen(true)
            }, 500)

        } else {
            // 设置为加载
            setLoadingIndex(list.length);

            //  写入数据
            list.push(question[questionIndexRef.current += 1])
            setList([...list])

            setTimeout(() => {
                setLoadingIndex(-1)
                contentRef.current!.scrollTop = contentRef.current!.scrollHeight
            }, 500)
        }
    }

    return <div className={styles.container}>

        <div className={styles.content} ref={contentRef}>
            {list.map((text, index) =>
                index % 2 === 0
                    ? (
                        <div key={index}>
                            <div className={styles.content_top}>
                                <div>
                                    <Image src={"/logo-dark.png"} width={20} height={20} alt={""}/>
                                </div>
                                <span>ENDAI</span>
                            </div>
                            <div className={styles.content_footer}>
                                {loadingIndex === index ? <Spin/> : <AnalogInputText text={text} />}
                            </div>
                        </div>
                    )
                    : <div key={index}>
                        <div className={styles.content_top}>
                            <div>
                                <div className={styles.icon_user}><UserIcon/></div>
                            </div>
                            <span>You</span>
                        </div>
                        <div className={styles.content_footer}>
                            {
                                editIndex === index
                                    ? <div className={styles.edit}>
                                        <Input value={editValue} autoFocus onInput={e => {
                                            // @ts-ignore
                                            setEditValue(e.target.value)
                                        }}/>
                                        <Space>
                                            <Button onClick={() => handleEdit(-1, "")}>Cancel</Button>
                                            <Button onClick={handleEditSave} type={"primary"}>Save</Button>
                                        </Space>
                                    </div>
                                    : text
                            }
                            {editIndex === -1 &&
                                <div className={styles.icon_edit} onClick={() => handleEdit(index, text)}><RenameIcon/>
                                </div>}
                        </div>
                    </div>
            )}
        </div>

        <div className={styles.input}>
            <div>
                <TextArea
                    value={inputValue}
                    autoSize={{minRows: 2, maxRows: 10}}
                    placeholder={"请回答"}
                    onInput={e => {
                        // @ts-ignore
                        setInputValue(e.target.value)
                    }}/>
                <div>
                    <Button type={"primary"} disabled={inputValue.length === 0} onClick={handleSend}>发送</Button>
                </div>
            </div>
            <p>系统会依次提出问题, 请点击Send提交</p>
        </div>

        <ModalForm<{
            username: string;
            phone: string;
        }>
            title="最后一步, 确认问卷信息"
            open={open}
            form={form}
            autoFocusFirstInput
            size={"large"}
            submitter={{
                render: (props, dom) => dom[1],
                submitButtonProps: {
                    size: "large",
                    style: {
                        width: '100%'
                    }
                },
            }}
            modalProps={{
                destroyOnClose: true,
                centered: true,
                closable: false,
            }}
            onFinish={async (values) => {

                const arr: { question: string, value: string }[] = [];
                const questionList = list.filter((item, index) => index % 2 === 0)
                const valueList = list.filter((item, index) => index % 2 !== 0)

                questionList.forEach((item, index) => {
                    arr.push({question: item, value: valueList[index]})
                })

                const data = {
                    ...values, content: JSON.stringify(arr)
                }

                await request('/api/psq', {method: 'post', data: data})

                //  跳转结果页
                router.replace('/psq/result')
            }}
        >
            <div className={styles.modal_hint}>
                <Alert message={`提交您的姓名电话, 问卷就可以提交啦!`} type="info" showIcon/>
            </div>

            <ProFormText
                name="username"
                label="姓名"
                required
                rules={[{required: true, message: '请输入姓名'}]}
            />
            <ProFormText
                name="phone"
                label="联系电话"
                required
                rules={[{required: true, message: '请输入联系电话'}]}
            />
        </ModalForm>

    </div>
}
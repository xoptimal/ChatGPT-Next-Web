'use client';

import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import Image from 'next/image'

import request from "@/app/utils/api";
import styles from './page.module.scss'
import {Button, Drawer, Empty, Modal} from "antd";
import {useState} from "react";
import {useRouter} from "next/navigation";

const valueEnum = {
    0: 'close',
    1: 'running',
    2: 'online',
    3: 'error',
};

export type TableListItem = {
    key: number;
    name: string;
    containers: number;
    creator: string;
    status: string;
    createdAt: number;
    progress: number;
    money: number;
    memo: string;
};


export default function ReportPage() {

    const [psqOpen, setPsqOpen] = useState(false)
    const [reportOpen, setReportOpen] = useState(false)
    const [selectItem, setSelectItem] = useState<any>(null)

    const router = useRouter()

    const onClickItem = (entity: any) => {

        const item: any = {...entity}
        item.psqList = JSON.parse(entity.content)

        setSelectItem(item)
        setPsqOpen(true)
    }

    const onClickReport = (entity?: any) => {
        if (entity) {
            setSelectItem(entity)
        }
        setReportOpen(true)
    }

    const handleJumpHome = () => {
        router.replace('/')
    }

    const columns: ProColumns[] = [
        {
            title: '邮箱账号',
            key: 'email',
            search: false,
            render: (_, entity) => entity.user.email
        },
        {
            title: '班级',
            key: 'class',
            render: (_, entity) => entity.user.class
        },
        {
            title: '学号',
            key: 'studentId',
            render: (_, entity) => entity.user.studentId
        },
        {
            title: '问卷',
            key: 'content',
            search: false,
            render: (_, entity) => <a onClick={() => onClickItem(entity)}>预览</a>
        },
        {
            title: '报告',
            key: 'report',
            search: false,
            render: (_, entity) => <a onClick={() => onClickReport(entity)}>查看</a>
        },
        {
            title: '创建时间',
            search: false,
            dataIndex: 'created_at',
            valueType: 'dateTime'
        },
        // {
        //     title: '操作',
        //     width: 180,
        //     key: 'option',
        //     valueType: 'option',
        //     render: () => [],
        // },
    ];

    return (
        <>
            <div className={styles.content}>
                <ProTable<TableListItem>
                    columns={columns}
                    request={async (params, sorter, filter) => {
                        const res = await request('/api/psq', {
                            params: params,
                            method: 'GET'
                        })
                        return {
                            data: res.data.list,
                            total: res.data.total,
                            success: res.status === 200,
                        }
                    }}
                    rowKey="id"
                    pagination={{
                        showQuickJumper: true,
                    }}
                    dateFormatter={'number'}
                    options={{
                        density: false,
                        search: false,
                        setting: false,
                        fullScreen: true,
                    }}
                    toolbar={{
                        title: '问卷列表',
                    }}
                />
            </div>

            <Drawer open={psqOpen} onClose={() => setPsqOpen(false)} title={'问卷预览'} width={600} footer={false}>
                <div className={styles.title}>
                    <div
                        className={styles.drawer_title}>来自<a>{selectItem?.user.email}</a>同学问卷调查
                    </div>
                    <Button type={"primary"} ghost onClick={() => onClickReport()}>查看报告</Button>
                </div>
                {
                    selectItem?.psqList?.map((item: any, index: number) =>
                        <div key={index} className={styles.item}>
                            <h1>{`${index + 1}.`}</h1>
                            <div>
                                <h1>{item.question}</h1>
                                <p>{item.value}</p>
                            </div>
                        </div>)
                }
            </Drawer>

            <Modal open={reportOpen} onCancel={() => setReportOpen(false)} title={'查看报告'} width={600}
                   footer={false}>
                {
                    selectItem?.report ?
                        <>
                            <div className={styles.title}>
                                <div className={styles.drawer_title}>来自<a>{selectItem?.user.email}</a>同学问卷调查,
                                    生成如下报告:
                                </div>
                            </div>
                            <div className={styles.report}>
                                {selectItem?.report}
                            </div>
                        </>
                        : <div><Empty style={{padding: '100px 0'}} description={"正在努力生成中..."}/></div>
                }
            </Modal>
        </>
    )
};
'use client';

import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {Button, Drawer, Empty, Modal} from "antd";
import {useRouter} from "next/navigation";
import request from "@/app/utils/api";
import {useState} from "react";

import styles from './page.module.scss'

export default function Content() {

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

    const columns: ProColumns[] = [

        {
            title: '班级',
            key: 'class',
            render: (_, entity) => <span>{entity.user.class}</span>
        },
        {
            title: '学号',
            key: 'studentId',
            render: (_, entity) => <span>{entity.user.studentId}</span>
        },
        {
            title: '姓名',
            key: 'username',
            render: (_, entity) => <span>{entity.user.username}</span>
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
    ];

    return (
        <div className={styles.content}>

            <ProTable
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

            <Drawer open={psqOpen} onClose={() => setPsqOpen(false)} title={'问卷预览'} width={600} footer={false}>
                <div className={styles.title}>
                    <div
                        className={styles.drawer_title}>来自<a>{selectItem?.user.username}</a>同学问卷调查
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
                                <div className={styles.drawer_title}>来自<a>{selectItem?.user.username}</a>同学问卷调查,
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
        </div>
    )
}



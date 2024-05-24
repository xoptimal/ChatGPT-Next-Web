'use client'
import {type ProColumns, ProDescriptionsItemProps} from "@ant-design/pro-components";
import {ROLE, UNIVERSITIES} from "@/app/utils/dic";
import ExTable from "@/app/components/ExTable";

export default function Page() {

    const columns: ProColumns[] = [
        {
            title: '学号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '姓名',
            dataIndex: 'username',
        },
        {
            title: '学校',
            key: 'school',
            dataIndex: 'school',
            valueEnum: UNIVERSITIES,
            search: false,
        },
        {
            title: '年级',
            dataIndex: 'class',
            search: false,
        },
        {
            title: '电话',
            dataIndex: 'phone',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '注册时间',
            search: false,
            dataIndex: 'createdAt',
            valueType: 'dateTime'
        },
    ];

    const viewColumns: ProDescriptionsItemProps[] = [
        ...columns as any,
        {
            title: '年龄',
            dataIndex: 'age',
        },
        {
            title: '成绩',
            dataIndex: 'score',
        },
        {
            title: '地址',
            dataIndex: 'address',
            span: 2
        },
    ]

    return <ExTable columns={columns}
                    viewColumns={viewColumns}
                    apiUrl={'/api/user'}
                    title={"学生列表"}
                    modalTitle={"学生详情"}
                    params={{role: ROLE.STUDENT}}/>

}
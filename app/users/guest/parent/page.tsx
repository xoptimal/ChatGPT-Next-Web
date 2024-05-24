import ExTable from "@/app/components/ExTable";
import {ProColumns} from "@ant-design/pro-components";
import {ROLE} from "@/app/utils/dic";

export default function Page() {

    const columns: ProColumns[] = [
        {
            title: '姓名',
            dataIndex: 'username',
        },
        {
            title: '年龄',
            dataIndex: 'age',
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
            title: '职业',
            dataIndex: 'job',
            search: false,
        },
        {
            title: '岗位',
            dataIndex: 'jobName',
            search: false,
        },
        {
            title: '注册时间',
            search: false,
            dataIndex: 'createdAt',
            valueType: 'dateTime'
        },
    ];

    return <ExTable columns={columns}
                    apiUrl={'/api/user'} title={"家长列表"}
                    modalTitle={"家长详情"} params={{role: ROLE.PARENT}}/>
}
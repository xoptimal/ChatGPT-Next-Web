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
            title: '电话',
            dataIndex: 'phone',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '国籍',
            dataIndex: 'country',
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
                    apiUrl={'/api/user'}
                    title={"顾问列表"}
                    modalTitle={"顾问详情"}
                    params={{role: ROLE.COUNSELOR}}/>
}
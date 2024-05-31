import ExTable from "@/app/components/ExTable";
import {ProColumns} from "@ant-design/pro-components";
import {ENTITY_TYPE, ROLE} from "@/app/utils/dic";

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
            title: '类型',
            valueEnum: ENTITY_TYPE,
            dataIndex: 'entityType',
            search: false,
        },
        {
            title: '企业名称',
            dataIndex: 'companyName',
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
                    apiUrl={'/api/user'} title={"渠道列表"}
                    modalTitle={"渠道详情"} params={{role: ROLE.CHANNEL}}/>
}
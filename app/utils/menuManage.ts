import {ROLE} from "@/app/utils/dic";


const student = [
    {
        path: '/welcome',
        name: '欢迎',
        icon: 'SmileFilled'
    },
    {
        path: '/student/appointment',
        name: '预约咨询',
        icon: 'SmileFilled'
    },
    {
        path: '/task',
        name: '任务中心',
        icon: 'SmileFilled'
    },
    {
        path: '/profile',
        name: '信息中心',
        icon: 'SmileFilled'
    },
    {
        path: '/product',
        name: '产品中心',
        icon: 'SmileFilled'
    },
    {
        path: '/gpt',
        name: 'GPT',
        icon: 'SmileFilled'
    },
]

const admin = [
    {
        path: '/welcome',
        name: '欢迎',
        icon: 'SmileFilled'
    },
    {
        path: '/users',
        name: '用户管理',
        icon: 'SmileFilled',
        routes: [
            {
                path: '/users/guest',
                name: '签约客户',
                icon: 'SmileFilled',
                routes: [
                    {
                        path: '/users/guest/student',
                        name: '学生',
                    },
                    {
                        path: '/users/guest/parent',
                        name: '家长',
                    },
                ]
            },
            {
                path: '/users/counselor',
                name: '顾问',
                icon: 'SmileFilled'
            },
            {
                path: '/users/channel',
                name: '渠道',
                icon: 'SmileFilled'
            },
        ]
    },

    {
        path: '/apply',
        name: '用户申请管理',
        icon: 'SmileFilled',
        routes: [
            {
                path: '/apply/guest',
                name: '普通用户',
                icon: 'SmileFilled',
            },
            {
                path: '/apply/counselor',
                name: '顾问',
                icon: 'SmileFilled'
            },
            {
                path: '/apply/channel',
                name: '渠道',
                icon: 'SmileFilled'
            },
        ]
    },

    {
        path: '/service',
        name: '服务管理',
        icon: 'SmileFilled',
        routes: [
            {
                path: '/service/product',
                name: '签约客户',
                icon: 'SmileFilled'
            },
            {
                path: '/service/schedule',
                name: '服务进度监督',
                icon: 'SmileFilled'
            },
        ]
    },
    {
        path: '/data',
        name: '信息中心',
        icon: 'SmileFilled'
    },
]

const counselor = [
    {
        path: '/welcome',
        name: '欢迎',
        icon: 'SmileFilled'
    },
    {
        path: '/counselor/apply',
        name: '顾问申请',
        icon: 'SmileFilled'
    },
    {
        path: '/counselor/schedule',
        name: '管理日程',
        icon: 'SmileFilled'
    },
    {
        path: '/counselor/profile',
        name: '信息中心',
        icon: 'SmileFilled'
    },
    {
        path: '/gpt',
        name: 'GPT',
        icon: 'SmileFilled'
    },
]

export function getMenus(role: number = -1) {

    let routes: any[] = []

    switch (role) {
        case ROLE.STUDENT:
            return student;
        case ROLE.ADMIN:
            return admin;
        case ROLE.COUNSELOR:
            return counselor;
        default:
            return routes
    }
}
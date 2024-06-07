import {ROLE} from "@/app/utils/dic";


const student = [
    // {
    //     path: '/welcome',
    //     name: '欢迎',
    //     icon: 'SmileFilled'
    // },
    {
        path: '/student/appointment',
        name: '预约咨询',
    },
    {
        path: '/student/task',
        name: '任务中心',
    },
    // {
    //     path: '/student/profile',
    //     name: '个人中心',
    //     icon: 'SmileFilled'
    // },
    // {
    //     path: '/student/product',
    //     name: '产品中心',
    //     icon: 'SmileFilled'
    // },
    {
        path: '/gpt',
        name: 'GPT',
    },
]

const admin = [
    // {
    //     path: '/welcome',
    //     name: '欢迎',
    //     icon: 'SmileFilled'
    // },
    {
        path: '/admin/users',
        name: '用户管理',
        routes: [
            {
                path: '/admin/users/guest',
                name: '签约客户',
                routes: [
                    {
                        path: '/admin/users/guest/student',
                        name: '学生',
                    },
                    {
                        path: '/admin/users/guest/parent',
                        name: '家长',
                    },
                ]
            },
            {
                path: '/admin/users/counselor',
                name: '顾问',
            },
            {
                path: '/admin/users/channel',
                name: '渠道',
            },
        ]
    },

    {
        path: '/admin/apply',
        name: '申请管理',
        routes: [
            {
                path: '/admin/apply/guest',
                name: '普通用户',
            },
            {
                path: '/admin/apply/counselor',
                name: '顾问',
            },
            {
                path: '/admin/apply/channel',
                name: '渠道',
            },
        ]
    },

    // {
    //     path: '/service',
    //     name: '服务管理',
    //     icon: 'SmileFilled',
    //     routes: [
    //         // {
    //         //     path: '/service/product',
    //         //     name: '签约客户',
    //         //     icon: 'SmileFilled'
    //         // },
    //         {
    //             path: '/service/schedule',
    //             name: '服务进度监督',
    //             icon: 'SmileFilled'
    //         },
    //     ]
    // },
    {
        path: '/admin/psq',
        name: '问卷管理',
    },
    {
        path: '/task',
        name: '任务中心',
    },
    {
        path: '/statistics',
        name: '数据管理',
    },
]

const counselor = [
    // {
    //     path: '/welcome',
    //     name: '欢迎',
    //     icon: 'SmileFilled'
    // },
    // {
    //     path: '/counselor/apply',
    //     name: '顾问申请',
    //     icon: 'SmileFilled'
    // },
    {
        path: '/counselor/schedule',
        name: '管理日程',
    },
    {
        path: '/task',
        name: '任务中心',
    },
    // {
    //     path: '/counselor/profile',
    //     name: '个人中心',
    //     icon: 'SmileFilled'
    // },
    {
        path: '/gpt',
        name: 'GPT',
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

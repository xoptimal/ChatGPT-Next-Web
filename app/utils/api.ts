import {NextRequest} from "next/server";
import axios from "axios";
import {message} from "antd";

export function getQuery<T = any>(req: NextRequest): T {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const obj: Record<string, any> = {}
    for (const [key, value] of searchParams) {
        obj[key] = value;
    }
    console.log("params", obj)
    return obj as T;
}


const request = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    timeout: 500000, // 请求超时时间
});

export type ResponseTYpe<T = any> = {
    data: T,
    status: number,
    statusText: string,
}

request.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res.status !== 200) {
            // // B002:Token 过期了;
            // if (res.code === 'B002') {
            //     // 最后一次出弹框
            //     if (needLoadingRequestCount === 0) {
            //         MessageBox.confirm(
            //             `你已被登出，可以取消继续留在该页面，
            // 或者重新登录, 确定登出`,
            //             {
            //                 confirmButtonText: '重新登录',
            //                 cancelButtonText: '取消',
            //                 type: 'warning',
            //             },
            //         ).then(() => {
            //             // 返回登录页
            //             // ...做些事情
            //             // 为了重新实例化vue-router对象 避免bug
            //             location.reload();
            //         });
            //     }
            // } else {
            //     message.error(res.msg);
            // }
            return Promise.reject(res.msg || 'error');
        } else {
            // // 如果存在token
            // let token = response.headers.authorization;
            // if (token) {
            //     localStorage.setItem('token', token);
            // }
            return response.data
        }
    },
    (error) => {
        message.error(error);
        return Promise.reject(error);
    },
);

export default request;

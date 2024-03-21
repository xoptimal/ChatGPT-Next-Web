import {message} from "antd";


export default function handlerError(e: unknown) {
    let msg;
    if (typeof e === "string") {
        msg = e.toUpperCase()
    } else if (e instanceof Error) {
        msg = e.message
    }
    message.error(msg).then(() => {
        
    })
}
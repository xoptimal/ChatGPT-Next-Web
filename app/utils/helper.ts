import { message } from "antd";

export function handlerError(e: unknown) {
  let msg;
  if (typeof e === "string") {
    msg = e.toUpperCase();
  } else if (e instanceof Error) {
    msg = e.message;
  }
  message.error(msg).then(() => {});
}

export function getImageUrl(uid: String) {
  const uploadUrl = "http://sdn3icoqm.hn-bkt.clouddn.com/" + uid;
  return uploadUrl;
}

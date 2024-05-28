import dayjs from "@/lib/dayjs";
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

export function formatDateToFromNow(date: Date) {
  const now = dayjs();
  const target = dayjs(date);
  const diff = now.diff(target, 'day');

  if (diff > 1) {
    return target.format('YYYY-MM-DD HH:mm:ss');
  } else {
    return target.fromNow();
  }
}


export function formatDate(date: Date, config?: {showTime: boolean}) {
  let format="YYYY-MM-DD"
  if(config && config.showTime) {
    format = "YYYY-MM-DD HH:mm:ss";
  }
  return dayjs(date).format(format);
}

export function formatAttachmentToList(
  attachment?: string,
): { uid: string; name: string }[] {
  let attachmentList: any[] =[];
  if (attachment) {
    attachmentList = JSON.parse(attachment);
    if (!Array.isArray(attachmentList)) {
      attachmentList = [attachmentList];
    }
  }
  return attachmentList //.map(item => ({...item, status: 'done'}));
}

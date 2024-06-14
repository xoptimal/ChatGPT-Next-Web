import dayjs from "@/lib/dayjs";
import { message } from "antd";

function handlerError(e: unknown) {
  let msg;
  if (typeof e === "string") {
    msg = e.toUpperCase();
  } else if (e instanceof Error) {
    msg = e.message;
  }
  message.error(msg).then(() => {});
}

function getImageUrl(uid: String) {
  const uploadUrl = "http://sdn3icoqm.hn-bkt.clouddn.com/" + uid;
  return uploadUrl;
}

function formatDateToFromNow(date: Date) {
  const now = dayjs();
  const target = dayjs(date);
  const diff = now.diff(target, "day");

  if (diff > 1) {
    return target.format("YYYY-MM-DD HH:mm:ss");
  } else {
    return target.fromNow();
  }
}

function formatDate(date: Date, config?: { showTime: boolean }) {
  if (!date) {
    return "";
  }

  let format = "YYYY-MM-DD";
  if (config && config.showTime) {
    format = "YYYY-MM-DD HH:mm:ss";
  }
  return dayjs(date).format(format);
}

function formatAttachmentToList(
  attachment?: string,
): { uid: string; name: string }[] {
  let attachmentList: any = [];

  if (!attachment) {
    return attachmentList;
  }

  if (typeof attachment === "string") {
    attachmentList = JSON.parse(attachment);
  } else {
    attachmentList = attachment;
  }

  if (!Array.isArray(attachmentList)) {
    attachmentList = [attachmentList];
  }

  return attachmentList.map((item: any) => ({ ...item, status: "done" }));
}

function transformAttachment(fileList?: any[], toJson = true) {
  let fileJson;
  if (fileList && fileList.length > 0) {
    fileJson = fileList.map((item) => ({ uid: item.uid, name: item.name }));

    if (toJson) fileJson = JSON.stringify(fileJson);
  }
  return fileJson;
}

export {
  transformAttachment,
  handlerError,
  getImageUrl,
  formatDateToFromNow,
  formatAttachmentToList,
  formatDate,
};

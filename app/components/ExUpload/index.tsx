import { Button, GetProp, message, Upload, UploadProps } from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import request from "@/app/utils/api";
// @ts-ignore
import * as qiniu from "qiniu-js";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

async function manualUpload(file: any, callback: any) {
  const { data } = await request("/api/qiniu/getToken");
  const observable = qiniu.upload(file, file.uid, data.uploadToken);
  const subscription = observable.subscribe({
    complete(res: any) {
      callback({
        file,
        ...file,
        name: file.name,
        status: "done",
        response: res, // 服务端响应内容
      });
    },
  }); // 上传开始

  // @ts-ignore
  observable.subscribe(subscription);
}

export default function (props: any) {
  const {
    imageClassName,
    className,
    onChange,
    maxCount = 1,
    uploadProps,
  } = props;

  const [fileList, setFileList] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<any>();

  const handleChange: UploadProps["onChange"] = (info) => {

    if (info.fileList?.length === 1) {
      const file = info.fileList[0];

      if (file.type === "image/jpeg") {
        getBase64(file.originFileObj as FileType, (url) => {
          setImageUrl(url);
        });
      }
    }
    onChange?.(info);
  };

  const onRemove = (file: any) => {
    setFileList((prev: any) =>
      prev.filter((item: any) => item.uid !== file.uid),
    );
  };

  const beforeUpload = async (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    //  图片处理
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
        return isLt2M;
      }
    }

    await manualUpload(file, (uploadFile: any) => {
      setFileList((prev: any) => [...prev, uploadFile]);
    });

    return false;
  };

  const uploadButton = <Button icon={<UploadOutlined />}>点击上传</Button>;

  return (
    <div className={className}>
      <Upload
        maxCount={maxCount}
        fileList={fileList}
        onRemove={onRemove}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        showUploadList={!imageUrl}
        {...uploadProps}
      >
        {fileList.length < maxCount
          ? uploadButton
          : imageUrl && (
              <img src={imageUrl} alt="" className={imageClassName} />
            )}
      </Upload>
    </div>
  );
}

"use client";
import request from "@/app/utils/api";
import { BetaSchemaForm } from "@ant-design/pro-components";
import { useAsyncEffect } from "ahooks";
import { Button, Form, Modal, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const psqList = [
  "1.你目前的年级是什么？你在哪个年级？",
  "2.你上的是哪所高中？",
  "3.你的成绩怎么样？你的成绩如何？",
  "4.你想追求什么职业？",
  "5.你想主修什么？",
  "6.如果你能做任何你想做的事，没有任何限制，你会做什么，为什么？",
  "7.你有什么兴趣和爱好？你还有其他兴趣/爱好吗？",
  "8.你喜欢在哪个国家生活？",
  "9.你想上什么大学？",
  "10.你打算如何支付大学学费？",
];

export default function PsqButton(props: React.PropsWithChildren) {
  const { children } = props;

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      const arr: { question: string; value: string }[] = [];
      psqList.forEach((item, index) => {
        arr.push({ question: item, value: values[`psq_${index}`] });
      });
      setLoading(true);
      await request("/api/psq", {
        method: "post",
        data: { content: JSON.stringify(arr) },
      });
      setLoading(false);
      setOpen(false);
      setShow(false);
      message.success("问卷提交成功, 2秒后自动跳转到预约页面");
      setTimeout(() => {
        router.replace("/student/appointment");
      }, 2000);
    });
  };

  const [show, setShow] = useState(false);

  useAsyncEffect(async () => {
    const { data } = await request("/api/psq");
    setShow(!data);
  }, []);

  const columns = psqList.map((title, index) => ({
    key: `psq_${index}`,
    title,
    formItemProps: {
      rules: [{ required: true, message: "此项为必填项" }],
    },
  }));

  return (
    <>
      {show && <Button onClick={() => setOpen(true)}>{children}</Button>}

      <Modal
        title="问卷"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        width={800}
      >
        <BetaSchemaForm form={form} columns={columns} submitter={false} />
      </Modal>
    </>
  );
}

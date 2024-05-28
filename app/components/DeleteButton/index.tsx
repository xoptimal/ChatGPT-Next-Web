import request from "@/app/utils/api";
import { Popconfirm, message } from "antd";

type DeleteButtonProps = {
  showMessage?: boolean;
  delId: string | number;
  apiUrl: string,
  onCallback?: () => void;
};

export default function DeleteButton(props: DeleteButtonProps) {
  const { delId, showMessage, onCallback, apiUrl } = props;

  return (
    <Popconfirm
      key="delete"
      title="您确定要删除这条数据吗?"
      onConfirm={async () => {
        await request(apiUrl, {
          data: JSON.stringify({ id: delId }),
          method: "DELETE",
        });
        if (showMessage) {
          message.success("删除成功");
        }
        onCallback?.();
      }}
      okText="确定"
      cancelText="取消"
    >
      <a>删除</a>
    </Popconfirm>
  );
}

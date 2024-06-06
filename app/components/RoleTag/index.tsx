import { getRole } from "@/app/utils/dic";
import { Tag } from "antd";

export default function RoleTag(props: { role?: number; type?: number }) {
  const { role, type } = props;
  const [color, text] = getRole(role, type);
  return <Tag color={color}>{text}</Tag>;
}

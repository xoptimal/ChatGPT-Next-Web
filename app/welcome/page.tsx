"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getMenus } from "@/app/utils/menuManage";
import styles from "./page.module.scss";

export default function Page(props: any) {
  const router = useRouter();

  const { data: session } = useSession();

  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    setMenus(getMenus(session?.user.role));
  }, [session]);

  async function gotoPage(item: any) {
    router.push(item.path);
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>{props.children}</div>
      <div className={styles.content}>
        {menus.map((item, index) => (
          <div
            key={index}
            onClick={() => gotoPage(item)}
            className={styles.item}
          >
            <div>
              <h1>{item.name}</h1>
              {/*  <h2>{item.subTitle}</h2> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
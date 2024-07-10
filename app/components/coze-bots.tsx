import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useCozeStore } from "../store";

import styles from "./coze-bots.module.scss";
import { useEffect } from "react";

const bots = [

  {
    name: "探险家",
    id: "7387583435898241030",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
];

export function CozeBots() {
  const navigate = useNavigate();
  const store = useCozeStore();

  async function fetchInitialAssistantList() {
    try {
      //  添加到Store
      store.setSessions(bots);
    } catch (e) {
      console.log("e", e);
    }
  }

  useEffect(() => {
    fetchInitialAssistantList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  return (
    <div className={styles.container}>
      {bots.map((item, index) => (
        <Button
          size={"large"}
          key={item.id}
          onClick={() => {
            navigate(Path.COZE);
            store.selectSession(index);
          }}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
}

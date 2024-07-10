import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useCozeStore } from "../store";

import styles from "./coze-bots.module.scss";
import { useEffect } from "react";

const bots = [
  {
    name: "国内",
    id: "7387343977437069364",
    token:
      "pat_tnQKRdgU368SnjQE4NdPrk63PdWDmV6GS3QwKMX8jvFgdAmnsBjLzqZWFY33BPeE",
  },

  {
    name: "国外",
    id: "7385165908941635592",
    token:
      "pat_J2Yh6fEXhsx8XFtdefLsMZ4VOx2iXWBzxxWaHArWrikT4txuFeGAQdLcMO3lBXyD",
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

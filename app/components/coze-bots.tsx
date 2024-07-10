import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useCozeStore } from "../store";

import styles from "./coze-bots.module.scss";
import { useEffect } from "react";

const bots = [
  // {
  //   name: "探险家",
  //   id: "7387583435898241030",
  //   token:
  //     "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  // },
  {
    name: "心理测评",
    id: "7387603191824908293",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "心理健康和支持",
    id: "7387360521332260869",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "教育资讯",
    id: "7387359953755455494",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "翻译",
    id: "7387359474053005318",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "语言学习",
    id: "7387359474052759558",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "编码助手",
    id: "7387359357400760326",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "文学手法",
    id: "7387359357400301574",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "内容创作",
    id: "7387358746068090885",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "书籍推荐",
    id: "7387357929282453510",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "职业规划",
    id: "7387358613096005637",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "创意生成",
    id: "7387359120640245766",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "讨论伙伴",
    id: "7387357787229241350",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "自我认知",
    id: "7387357089334558726",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "学习管理",
    id: "7387354798829568005",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "SAT 阅读练习",
    id: "7387354303012782085",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "升学顾问",
    id: "7387355592471986182",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "研究助理",
    id: "7387354467547201542",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "文书导师",
    id: "7387242663663763461",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "个人陈述导师",
    id: "7387241139080265734",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "数学导师",
    id: "7387353017361940486",
    token:
      "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
  },
  {
    name: "大学咨询",
    id: "7387356046521843717",
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

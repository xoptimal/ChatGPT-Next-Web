'use client';

import {useNavigate} from "react-router-dom";
import {useCozeStore} from "../store";

import styles from "./coze-bots.module.scss";
import {useEffect, useState} from "react";
import {Path} from "@/app/constant";

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
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "心理测评",
        id: "7387603191824908293",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "心理健康和支持",
        id: "7387360521332260869",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "教育资讯",
        id: "7387359953755455494",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "翻译",
        id: "7387359474053005318",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "语言学习",
        id: "7387359474052759558",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "编码助手",
        id: "7387359357400760326",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "文学手法",
        id: "7387359357400301574",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "内容创作",
        id: "7387358746068090885",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "书籍推荐",
        id: "7387357929282453510",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "职业规划",
        id: "7387358613096005637",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "创意生成",
        id: "7387359120640245766",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "讨论伙伴",
        id: "7387357787229241350",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "自我认知",
        id: "7387357089334558726",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "学习管理",
        id: "7387354798829568005",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "SAT 阅读练习",
        id: "7387354303012782085",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "升学顾问",
        id: "7387355592471986182",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "研究助理",
        id: "7387354467547201542",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "文书导师",
        id: "7387242663663763461",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "个人陈述导师",
        id: "7387241139080265734",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "数学导师",
        id: "7387353017361940486",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "大学咨询",
        id: "7387356046521843717",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "学习导师",
        id: "7387349366723395590",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "概念解析",
        id: "7387353074555781125",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "签证指导",
        id: "7387356648354578437",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "国际交流",
        id: "7387359988836057094",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "感谢信",
        id: "7387359357400956934",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "兴趣探索",
        id: "7387357219090120710",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "面试指导",
        id: "7387356311580901381",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "升学指导",
        id: "7387355210815455238",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "教育资讯",
        id: "7387231660439502853",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "人格分析",
        id: "7387234423055712262",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "技能提升与创意表达",
        id: "7387583841667497989",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "升学与职业规划",
        id: "7387583261805592581",
    },
    {
        token:
            "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
        name: "学术与学习支持",
        id: "7387582627538501638",
    },
];

const mainBot = {
    name: "全能AI",
    id: "7392402031929720837",
    token:
        "pat_mOmnjXGXizEZ5r7WMp11mbXBWT6cpJz46EqJOhwQ05PzjByTD0dfODeKq2NK8xnZ",
}

export function CozeBots() {
    const navigate = useNavigate();
    const store = useCozeStore();

    async function fetchInitialAssistantList() {
        try {
            //  添加到Store
            store.setSessions([...bots, mainBot]);
        } catch (e) {
            console.log("e", e);
        }
    }

    const [circleList, setCircleList] = useState<any[]>([])

    function init() {

        let index = 1;
        let total = 10;
        let list: any[] = [];
        let circleList: any[] = [];
        bots.forEach((item, botIndex) => {
            if (list.length < total) {
                list.push({...item, botIndex})
            }

            if (list.length === total || botIndex === bots.length - 1) {
                index += 1;
                const size = (index * (100 + (index + 2) * 10));
                circleList.push({
                    urlStyle: {
                        width: size + 'px',
                        height: size + 'px',
                    },
                    transform: planAngle(list.length, size / 2, 60 * list.length),
                    list
                })
                list = [];
                total = total * 2;
            }
        })

        circleList = circleList.reverse().map((item, index) => ({
            ...item,
            urlStyle: {...item.urlStyle, zIndex: index,}
        }))

        setCircleList(circleList)
    }

    function planAngle(n: number, r: number, a: number) {
        let num = n
        let angle = 360 / num
        let arr = []
        for (let index = 0; index < num; index++) {
            arr.push(index * angle)
        }
        arr = arr.map(d => getAxis(r, d, a))
        return arr
    }

    // r 半径 angle 计算出得角度  add 偏差角度
    function getAxis(r: number, angle: number, add: number) {
        // 公式，r-半径，angle-角度
        // x: r+r*Math.sin(angle*Math.PI/180)
        // y: r-r*Math.cos(angle*Math.PI/180)
        return `translate(${r * Math.sin((angle + add) * Math.PI / 180) + r}px, ${r - r * Math.cos((angle + add) * Math.PI / 180)}px)`
    }

    useEffect(() => {
        init()
        fetchInitialAssistantList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClick = (botIndex: number) => {
        navigate(Path.COZE);
        store.selectSession(botIndex);
    }

    return (
        <div className={styles.container}>

            {
                circleList.map((item, index) =>
                    <div className={styles.ulDiv} style={item.urlStyle} key={index}>{
                        item.list.map((child: any, childIndex: number) => (
                            <div className={styles.liDiv} key={childIndex}
                                 style={{transform: item.transform[childIndex]}}
                                 onClick={() => onClick(child.botIndex)}
                            >
                                <span>{child.name}</span>
                            </div>))
                    }
                    </div>)
            }

            <div onClick={() => onClick(bots.length)}
                 className={`${styles.ulDiv} ${styles.centerPeople} ${styles.main_bot}`}>
                <span>{mainBot.name}</span>
            </div>

        </div>
    );
}

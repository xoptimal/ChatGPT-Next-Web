"use client";

import ExContainer, { ExContainerRef } from "@/app/components/ExContainer";
import ExUpload from "@/app/components/ExUpload";
import { scrollToTop } from "@/app/components/ScrollToTopButton";
import request from "@/app/utils/api";
import { Button, Descriptions, message, Radio, Result, Space } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./page.module.scss";
import { counselorLevelOptions } from "@/app/utils/dic";

export default function Page() {
  const [index, setIndex] = useState(0);

  const { data: session } = useSession();

  const [fileList, setFileList] = useState<any[]>([]);

  const [level, setLevel] = useState(1);

  const [data, setData] = useState<any>();

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.warning("请上传资料");
      return;
    }

    const data = {
      attachment: JSON.stringify({
        uid: fileList[0].uid,
        name: fileList[0].name,
      }),
      message: "顾问申请",
      username: session?.user.username,
      phone: session?.user.phone,
      type: level,
      category: 1,
      userId: session?.user.userId,
    };

    await request("/api/product", { method: "POST", data });

    containerRef.current?.refresh();
  };

  const next = (index: number) => {
    setIndex(index);
    scrollToTop();
  };

  const router = useRouter();

  const jump = () => {
    router.replace("/");
  };

  const containerRef = useRef<ExContainerRef>(null);

  return (
    <div className={styles.root}>
      <ExContainer
        ref={containerRef}
        request={async () => {
          const { data } = await request("/api/product/find");
          setData(data);
        }}
      >
        {data ? (
          <div className={styles.container}>
            {data.status === 0 ? (
              <Result
                status="info"
                title="顾问申请已提交"
                subTitle="请等待后台客服审核, 这个过程需要些时间, 请不定期刷新页面获取结果"
                extra={[
                  <Button key="buy" onClick={jump}>
                    返回首页
                  </Button>,
                ]}
              />
            ) : (
              <Result
                status="success"
                title="顾问申请成功!"
                subTitle="您的申请已通过, 现在你可以开始定制你的咨询日期, 迎接学生的咨询"
                extra={[
                  <Button key="buy" onClick={jump}>
                    返回首页
                  </Button>,
                ]}
              />
            )}
          </div>
        ) : (
          <>
            {index === 0 && (
              <div className={styles.container}>
                <h1>顾问申请条件</h1>
                <h2>教育背景</h2>
                <ol>
                  <li>
                    <strong>本科及以上学历</strong>
                    ：通常要求有教育、心理学、国际关系或相关领域的学位。
                  </li>
                  <li>
                    <strong>相关认证</strong>
                    ：拥有教育顾问、职业顾问或类似的专业认证，如NACAC（National
                    Association for College Admission
                    Counseling）或IECA（Independent Educational Consultants
                    Association）的认证，会增加申请的竞争力。
                  </li>
                </ol>

                <h2>工作经验</h2>
                <ol>
                  <li>
                    <strong>行业经验</strong>
                    ：具有在教育、培训或出国留学咨询方面的工作经验，通常需要至少2-3年的相关经验。
                  </li>
                  <li>
                    <strong>辅导经验</strong>
                    ：有辅导学生准备留学申请、签证申请、考试准备（如TOEFL、IELTS、SAT、GRE等）的经验。
                  </li>
                  <li>
                    <strong>项目管理</strong>：有管理或协调国际教育项目的经验。
                  </li>
                </ol>

                <h2>技能要求</h2>
                <ol>
                  <li>
                    <strong>沟通能力</strong>
                    ：出色的口头和书面沟通能力，能够与学生、家长、学校和大学代表有效沟通。
                  </li>
                  <li>
                    <strong>跨文化理解</strong>
                    ：了解并能够处理跨文化交流中的各种问题。
                  </li>
                  <li>
                    <strong>组织能力</strong>
                    ：能够管理多个学生的申请流程，保证每个步骤都按时完成。
                  </li>
                  <li>
                    <strong>问题解决能力</strong>
                    ：能够帮助学生解决在申请过程中遇到的各种问题和挑战。
                  </li>
                  <li>
                    <strong>客户服务</strong>
                    ：以学生的需求为中心，提供高质量的服务。
                  </li>
                </ol>

                <h2>知识要求</h2>
                <ol>
                  <li>
                    <strong>国际教育体系</strong>
                    ：了解主要留学目的地国家（如美国、英国、加拿大、澳大利亚等）的教育体系、申请流程、签证要求等。
                  </li>
                  <li>
                    <strong>考试准备</strong>
                    ：熟悉TOEFL、IELTS、SAT、ACT、GRE、GMAT等考试的内容和备考策略。
                  </li>
                  <li>
                    <strong>申请文书</strong>
                    ：能够指导学生撰写优秀的个人陈述、推荐信和简历。
                  </li>
                </ol>

                <h2>个性特质</h2>
                <ol>
                  <li>
                    <strong>耐心和同理心</strong>
                    ：能够理解学生和家长的担忧，耐心解答问题。
                  </li>
                  <li>
                    <strong>细致和责任心</strong>
                    ：在处理申请材料时细致入微，确保信息准确无误。
                  </li>
                  <li>
                    <strong>灵活性</strong>
                    ：能够根据不同学生的需求和背景调整咨询策略。
                  </li>
                </ol>

                <h2>其他要求</h2>
                <ol>
                  <li>
                    <strong>语言能力</strong>
                    ：流利的英语能力是必需的，如果还会其他语言（如学生常申请的国家的语言），将会是一个加分项。
                  </li>
                  <li>
                    <strong>技术能力</strong>
                    ：熟练使用办公软件和在线沟通工具，能够熟练操作留学申请系统和管理学生信息的软件。
                  </li>
                </ol>
              </div>
            )}

            {index === 1 && (
              <div className={styles.container}>
                <h1>顾问服务协议</h1>

                <p>
                  为了明确双方在合作中的权利和义务，甲乙双方在平等自愿的基础上，就顾问服务事宜达成以下协议：
                </p>

                <h2>一、顾问职责</h2>

                <ol>
                  <li>
                    乙方根据甲方的要求，提供专业的出国留学咨询服务，包括但不限于以下内容：
                    <ul>
                      <li>
                        辅导学生准备留学申请、签证申请、考试准备（如TOEFL、IELTS、SAT、GRE等）。
                      </li>
                      <li>协助学生撰写个人陈述、推荐信和简历。</li>
                      <li>提供目标院校和专业选择的建议。</li>
                      <li>指导学生应对面试及其他评估环节。</li>
                      <li>提供跨文化理解和适应方面的培训。</li>
                    </ul>
                  </li>
                  <li>
                    乙方应保证其提供的咨询服务具有专业性和准确性，并根据学生的具体情况提供个性化的建议。
                  </li>
                  <li>
                    乙方应保持与学生和甲方的沟通，及时反馈学生的进展情况和存在的问题。
                  </li>
                </ol>

                <h2>二、工作时间及方式</h2>

                <ol>
                  <li>
                    乙方应根据甲方和学生的需求，合理安排工作时间，确保及时、高效地完成咨询任务。
                  </li>
                  <li>
                    乙方可通过面谈、电话、邮件、视频会议等方式提供咨询服务。
                  </li>
                </ol>

                <h2>三、保密条款</h2>

                <ol>
                  <li>
                    乙方对在服务过程中获取的学生个人信息及甲方的商业信息应严格保密，不得向第三方披露。
                  </li>
                  <li>本保密义务在协议终止后仍然有效。</li>
                </ol>

                <h2>四、合同解除</h2>

                <ol>
                  <li>任何一方如需解除本协议，应提前书面通知对方。</li>
                  <li>如有违约行为，另一方有权解除协议并追究违约方责任。</li>
                </ol>

                <h2>五、争议解决</h2>

                <p>
                  如双方在履行本协议过程中发生争议，应友好协商解决；协商不成的，任何一方可向甲方所在地人民法院提起诉讼。
                </p>

                <h2>六、其他条款</h2>

                <p>
                  本协议未尽事宜，由双方协商一致后，以书面形式签订补充协议，补充协议与本协议具有同等法律效力。
                </p>
              </div>
            )}

            {index === 2 && (
              <div className={styles.container}>
                <h1>确认信息</h1>
                {session && (
                  <Descriptions
                    bordered
                    column={1}
                    className={styles.descriptions}
                    labelStyle={{
                      width: "130px",
                    }}
                  >
                    <Descriptions.Item label={"姓名"}>
                      {session.user.username}
                    </Descriptions.Item>
                    <Descriptions.Item label={"电话"}>
                      {session.user.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label={"申请内容"}>
                      已知悉
                    </Descriptions.Item>
                    <Descriptions.Item label={"协议内容"}>
                      已知悉
                    </Descriptions.Item>
                    <Descriptions.Item label={"申请级别"}>
                      <Radio.Group
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        options={counselorLevelOptions}
                      ></Radio.Group>
                    </Descriptions.Item>
                    <Descriptions.Item label={"附件"}>
                      <ExUpload
                        fileList={fileList}
                        onChange={(info: any) => {
                          setFileList(info.fileList);
                        }}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                )}
                <div className={styles.action}>
                  <Button
                    type={"primary"}
                    size={"large"}
                    style={{ width: "120px" }}
                    onClick={handleSubmit}
                  >
                    提交申请
                  </Button>
                </div>
              </div>
            )}

            <div className={styles.action}>
              <Space>
                {index === 1 && (
                  <>
                    <Button size={"large"} onClick={() => next(index - 1)}>
                      返回
                    </Button>
                    <Button
                      size={"large"}
                      type={"primary"}
                      onClick={() => next(index + 1)}
                    >
                      我已阅读, 同意并接受
                    </Button>
                  </>
                )}
                {index === 0 && (
                  <Button
                    size={"large"}
                    type={"primary"}
                    onClick={() => next(index + 1)}
                  >
                    我已知悉, 下一步
                  </Button>
                )}
              </Space>
            </div>
          </>
        )}
      </ExContainer>
    </div>
  );
}

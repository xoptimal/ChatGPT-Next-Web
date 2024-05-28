"use client";
import { ProCard } from "@ant-design/pro-components";
import { Button, message, Modal, Radio } from "antd";
import Image from "next/image";

import ExUpload from "@/app/components/ExUpload";
import request from "@/app/utils/api";
import { ROLE } from "@/app/utils/dic";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const vvvipObj = {
  price: 120000,
  type: 1,
  bankName: "招商银行",
  bankAccount: "6234 5678 9012 345",
  bankNumber: "恩代公司",
  content: (
    <>
      <h1>服务条款</h1>
      <h2>1. 服务描述</h2>
      <p>
        1.1
        本服务条款规定了在留学培训领域中提供的各种服务，包括但不限于学术辅导、申请指导、文书编辑、考试准备等。
      </p>
      <p>
        1.2 我们的服务旨在帮助学生实现留学目标，并为其提供必要的支持和指导。
      </p>

      <h2>2. 服务范围</h2>
      <p>2.1 我们的服务范围包括但不限于以下方面：</p>
      <ul>
        <li>学术辅导：提供课程辅导、学科辅导等服务。</li>
        <li>申请指导：提供留学申请流程指导、文书写作指导等服务。</li>
        <li>文书编辑：提供留学申请文书编辑、润色等服务。</li>
        <li>
          考试准备：提供标准化考试（如SAT、TOEFL、GRE等）的备考指导和资源支持。
        </li>
      </ul>
      <p>
        2.2
        我们将根据学生的需求和情况提供个性化的服务，以确保其最大程度上的受益。
      </p>

      <h2>3. 服务费用</h2>
      <p>
        3.1
        我们的服务费用将根据服务的类型、时长和复杂程度进行收费。具体费用标准将在服务合同中详细说明。
      </p>
      <p>3.2 学生在使用我们的服务前应当清楚了解并同意相关的费用和支付方式。</p>

      <h2>4. 服务期限</h2>
      <p>
        4.1
        服务期限将根据具体的服务内容和协议进行确定，双方应在服务协议中明确约定。
      </p>

      <h2>5. 取消和退款政策</h2>
      <p>
        5.1
        学生可以在特定情况下申请取消服务或退款，具体条件和政策将在服务合同中明确规定。
      </p>
      <p>5.2 我们保留根据具体情况决定是否接受取消或提供退款的权利。</p>

      <h2>6. 知识产权</h2>
      <p>6.1 我们保留所有提供的教材、课程资料、指导文件等知识产权。</p>
      <p>6.2 学生在使用我们的服务时，不得以任何形式侵犯我们的知识产权。</p>

      <h2>7. 免责声明</h2>
      <p>
        7.1
        我们将尽力为学生提供最优质的服务，但不对由于不可抗力或学生个人原因造成的影响承担责任。
      </p>
      <p>
        7.2
        学生在使用我们的服务时应当自行承担风险，并保证提供准确、真实的个人信息和材料。
      </p>

      <h2>8. 法律适用</h2>
      <p>8.1 本服务条款受所在地法律的管辖和解释。</p>
      <p>
        8.2
        任何因本服务条款引起的纠纷应当通过友好协商解决，协商不成的，双方可向所在地法院提起诉讼解决。
      </p>

      <h2>9. 其他条款</h2>
      <p>
        9.1
        本服务条款可能根据实际情况进行调整和修改，修改后的条款将在我们的网站上公布。
      </p>
      <p>9.2 任何未尽事宜，双方可协商并签订补充协议。</p>

      <h2>10. 联系方式</h2>
      <p>如果您有任何问题或疑问，可通过以下方式联系我们：</p>
      <ul>
        <li>
          地址：4th Floor, Building 8, 358 Kangding Road, Jing'an District,
          Shanghai
        </li>
        <li>电话：+86 183 0180 2101</li>
        <li>电子邮件：contact@nblessings.com</li>
      </ul>
    </>
  ),
};

const featureList = [
  { title: "功能1", user1: true, user2: true, user3: true },
  { title: "功能2", user1: false, user2: true, user3: true },
  { title: "功能3", user1: false, user2: false, user3: true },
  { title: "功能4", user1: false, user2: false, user3: true },
  { title: "功能5", user1: false, user2: true, user3: true },
  { title: "功能6", user1: false, user2: true, user3: true },
  { title: "功能7", user1: false, user2: false, user3: true },
  { title: "功能8", user1: false, user2: false, user3: true },
  { title: "功能9", user1: false, user2: true, user3: true },
];

export default function () {
  const [userOptions, setUserOptions] = useState<
    { label: string; value: string; phone: string }[]
  >([]);
  const [consent, setConsent] = useState(false);
  const [fileList, setFileList] = useState<any[]>();
  const [open, setOpen] = useState(false);
  const [selectItem, setSelectItem] = useState<any>(vvvipObj);

  const { data: session } = useSession();

  const [userIndex, setUserIndex] = useState(-1);

  useEffect(() => {
    const role = session?.user.role;
    if (role === ROLE.PARENT) {
      //  parent 如果是家长的话, 不一样的逻辑
    } else {
      //  查询是否有提交过签约 or 已经签约

      setUserOptions([
        {
          label: session?.user.username!,
          value: session?.user.userId!,
          phone: session?.user.phone!,
        },
      ]);
      setUserIndex(0);
    }
  }, [session]);

  const sign = (value: any) => {
    setSelectItem(value);
    setOpen(true);
  };

  async function handleSubmit() {
    if (!consent) {
      message.warning("请查看服务条款后, 统一并接受");
      return;
    }

    if (!fileList) {
      message.warning("请上传转账凭证");
      return;
    }

    const { content, ...rest } = selectItem;

    const data = {
      userId: userOptions[userIndex].value,
      username: userOptions[userIndex].label,
      phone: userOptions[userIndex].phone,
      ...rest,
      attachment: JSON.stringify({
        uid: fileList[0].uid,
        name: fileList[0].name,
      }),
      message: "银行转账凭证",
    };
    await request("/api/product", { method: "POST", data });
    message.success("成功!");
  }

  return (
    <>
      <div className={styles.content1}>
        <p className={styles.title}>选择最合适的版本</p>
        <div className={styles.cards}>
          <ProCard bordered>
            <div className={styles.card}>
              <div>
                <h1>普通用户</h1>
                <h2>初步咨询</h2>
                <h3>￥0</h3>
                <div>
                  <p>功能1</p>
                  <p>功能2</p>
                  <p>功能3</p>
                </div>
              </div>
              <Button block size={"large"} disabled>
                默认
              </Button>
            </div>
          </ProCard>
          <ProCard bordered>
            <div className={styles.card}>
              <div>
                <h1>VVVIP</h1>
                <h2>说明1</h2>
                <h3>￥12000</h3>
                <div>
                  <p>功能1</p>
                  <p>功能2</p>
                  <p>功能3</p>
                </div>
              </div>
              <Button
                type={"primary"}
                block
                size={"large"}
                onClick={() => sign(vvvipObj)}
              >
                签约
              </Button>
            </div>
          </ProCard>
          <ProCard bordered>
            <div className={styles.card}>
              <div>
                <h1>加州精英</h1>
                <h2>说明1</h2>
                <h3>￥30000</h3>
                <div>
                  <p>功能1</p>
                  <p>功能2</p>
                  <p>功能3</p>
                </div>
              </div>
              <Button
                type={"primary"}
                block
                size={"large"}
                onClick={() => sign(vvvipObj)}
              >
                签约
              </Button>
            </div>
          </ProCard>
        </div>
      </div>
      <div className={styles.content2}>
        <p className={styles.title}>套餐权益对比详情</p>
        <div className={styles.list}>
          <div>
            <div>功能</div>
            <div>普通用户</div>
            <div>VVVIP</div>
            <div>加州精英</div>
          </div>
          {featureList.map((item, index) => (
            <div key={index}>
              <div>{item.title}</div>
              <div>
                {item.user1 ? (
                  <CheckCircleOutlined
                    style={{ color: "#0d9cf5", fontSize: "18px" }}
                  />
                ) : (
                  <CloseCircleOutlined
                    style={{ color: "#999", fontSize: "18px" }}
                  />
                )}
              </div>
              <div>
                {item.user2 ? (
                  <CheckCircleOutlined
                    style={{ color: "#0d9cf5", fontSize: "18px" }}
                  />
                ) : (
                  <CloseCircleOutlined
                    style={{ color: "#999", fontSize: "18px" }}
                  />
                )}
              </div>
              <div>
                {item.user3 ? (
                  <CheckCircleOutlined
                    style={{ color: "#0d9cf5", fontSize: "18px" }}
                  />
                ) : (
                  <CloseCircleOutlined
                    style={{ color: "#999", fontSize: "18px" }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.customer}>
        <Image width={70} height={70} src={"/wechat-qrcode.png"} alt={""} />
        <span>{"咨询客服"}</span>
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={false}
        width={1100}
        styles={{
          content: {
            padding: 0,
          },
        }}
      >
        {selectItem && userIndex > -1 && (
          <ProCard split={"vertical"}>
            <ProCard colSpan={"732px"} ghost>
              <div className={styles.clause}>{selectItem.content}</div>
              <div className={styles.clause_footer}>
                <div
                  className={styles.icon_consent}
                  onClick={() => setConsent((prev) => !prev)}
                >
                  {consent && <CheckCircleOutlined />}
                </div>
                <span>我已阅读, 同意并接受</span>
              </div>
            </ProCard>
            <ProCard>
              <div className={styles.action}>
                <div>
                  <h2>签约信息</h2>
                  <div className={styles.bank}>
                    <div>
                      姓名:
                      {userOptions.length > 1 ? (
                        <Radio.Group options={userOptions}></Radio.Group>
                      ) : (
                        <span>{userOptions[userIndex].label}</span>
                      )}
                    </div>
                    <div>
                      手机号码: <span>{userOptions[userIndex].phone}</span>
                    </div>
                    <div>
                      支付金额: <span>{selectItem.price}</span>
                    </div>
                  </div>

                  <h3>银行转账</h3>
                  <div className={styles.bank}>
                    <div>
                      银行: <span>招商银行</span>
                    </div>
                    <div>
                      收款人户名: <span>恩代公司</span>
                    </div>
                    <div>
                      银行卡号: <span>{`6234 5678 9012 345`}</span>
                    </div>
                  </div>

                  <h3>转账凭证</h3>
                  <ExUpload
                    className={styles.upload}
                    imageClassName={styles.imageClassName}
                    onChange={(info: any) => {
                      setFileList(info.fileList);
                    }}
                  />
                </div>

                <div>
                  <Button
                    size={"large"}
                    type={"primary"}
                    block
                    onClick={handleSubmit}
                  >
                    提交
                  </Button>
                  <p className={styles.hint}>
                    提交审核,通过会联系到您, 请耐心等待!
                  </p>
                </div>
              </div>
            </ProCard>
          </ProCard>
        )}
      </Modal>
    </>
  );
}

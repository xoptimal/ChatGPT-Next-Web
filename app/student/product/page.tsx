import styles from "./page.module.scss";
import Image from "next/image";

export default function () {
  return (
    <div className={styles.container}>
      <div className={styles.service}>
        <h2>VVVIP 服务</h2>
        <p>
          VVVIP服务是为那些希望在留学过程中获得最高级别支持和个性化服务的学生设计的。该服务不仅包括从申请学校、准备材料、面试辅导到行前培训的全方位支持，还提供独特的增值服务，如24/7的顾问支持、顶级心理咨询和职业规划服务等。我们的顾问团队由前名校招生官和业内顶尖专家组成，他们将为每个学生量身定制留学计划，确保他们的申请在众多竞争者中脱颖而出。
        </p>
        <ul>
          <li>
            <strong>一对一申请指导</strong>
            ：专属顾问全程一对一指导，从学校选择到提交申请，确保每一步都精准无误。
          </li>
          <li>
            <strong>文书精修服务</strong>
            ：由前名校招生官亲自修改文书，确保文书内容打动招生官。
          </li>
          <li>
            <strong>模拟面试</strong>
            ：安排多轮模拟面试，包括视频面试和现场面试，确保学生应对自如。
          </li>
          <li>
            <strong>极端例子</strong>
            ：某学生希望申请哈佛大学，顾问团队帮助他找到一位哈佛大学教授进行研究项目合作，并最终成功获得教授推荐信，使他的申请脱颖而出。
          </li>
        </ul>
      </div>
      <div className={styles.service}>
        <h2>加州精英 服务</h2>
        <p>
          加州精英服务专为希望申请美国加州顶尖大学（如斯坦福大学、加州大学伯克利分校、加州大学洛杉矶分校等）的学生而设。我们的服务涵盖从学校选择、申请策略、文书指导到签证申请等各个环节。专家团队深谙加州大学系统及其他加州名校的申请要点和录取标准，帮助学生在激烈的竞争中获得优势。
        </p>
        <ul>
          <li>
            <strong>学校选择与申请策略</strong>
            ：根据学生背景与兴趣，制定详细的申请策略，确保每个申请都具有竞争力。
          </li>
          <li>
            <strong>文书指导与润色</strong>
            ：资深导师提供详细的文书指导，从选题到最终润色，确保文书内容符合学校要求。
          </li>
          <li>
            <strong>签证申请支持</strong>
            ：提供签证申请指导和模拟面试，确保学生顺利获得签证。
          </li>
          <li>
            <strong>极端例子</strong>
            ：某学生在高中阶段成绩并不突出，但通过参与我们安排的多项科研项目和社区服务活动，并在文书中突出其独特的领导力和创新能力，最终成功被加州大学洛杉矶分校录取。
          </li>
        </ul>
      </div>
      <div className={styles.contact}>
      <Image
          src="/wechat-qrcode.png"
          alt="微信二维码"
          width={150}
          height={150}
        ></Image>
        <div>
          <h2>联系方式</h2>
          <p>
            <strong>邮箱：</strong>contact@nblessings.com
          </p>
          <p>
            <strong>地址：</strong>4th Floor, Building 8, 358 Kangding Road,
                                                    Jing'an
                                                    District, Shanghai
          </p>
          <p>
            <strong>联系电话：</strong>+86 183 0180 2101
          </p>
        </div>
       
      </div>
    </div>
  );
}

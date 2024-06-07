import styles from "./page.module.scss";

export default function PreviewPsqList(props: any) {
  const {  name, psqList=[] } = props;

  return (
    <>
      <div className={styles.title}>
        <div className={styles.drawer_title}>
          来自<a>{name}</a>同学问卷调查
        </div>
      </div>
      {psqList.map((item: any, index: number) => (
        <div key={index} className={styles.item}>
          <div>
            <h1>{item.question}</h1>
            <p>{item.value}</p>
          </div>
        </div>
      ))}
    </>
  );
}
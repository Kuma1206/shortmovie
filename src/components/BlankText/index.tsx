import styles from "./style.module.scss";

type Props = {
  text: string; // ダミーテキスト（アクセシビリティ対策）
  length?: number; // 繰り返し回数
};

const BlankText = ({ text, length = 1 }: Props) => {
  const strings = new Array(length).fill(text);

  return <span className={styles.blankText}>{strings.join(" ")}</span>;
};

export default BlankText;

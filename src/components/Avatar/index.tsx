import styles from "./style.module.scss";

type Props = {
  src: string;
};

const Avatar = ({ src }: Props) => {
  if (src) {
    return <img src={src} className={styles.avatar} alt="User Avatar" />;
  } else {
    return <div className={styles.placeholder}></div>;
  }
};

export default Avatar;

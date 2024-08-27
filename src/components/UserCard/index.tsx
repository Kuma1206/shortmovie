import { User } from "../../types/user";
import BlankText from "../BlankText";
import styles from "./style.module.scss";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.cover}>
        {user.coverURL && <img src={user.coverURL} alt="" />}
      </div>
      <div className={styles.content}>
        <div>
          <h1 className={styles.title}>{user.name}</h1>
          <p className={styles.subtitle}>
            {user.title || <BlankText text="肩書きのダミーテキスト" />}
          </p>
          <p className={styles.description}>
            {user.description || (
              <BlankText text="プロフィールのダミーテキスト" length={4} />
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

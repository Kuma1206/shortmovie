import { Fragment, ReactNode } from "react";
import { useAuth } from "../../context/auth";
import Avatar2 from "../Avatar2";
import styles from "./style.module.scss"; // SCSSスタイルをインポート

// Propsの型を定義
interface UserMenu2Props {
  onClick: () => void; // onClickは関数型
}

const UserMenu2: React.FC<UserMenu2Props> = ({ onClick }) => {
  const user = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className={styles.userMenu} onClick={onClick}>
      <Avatar2 src={user?.photoURL} />
    </div>
  );
};

export default UserMenu2;

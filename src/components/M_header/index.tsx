import { useState } from "react";
import { useAuth } from "../../context/auth";
import { login } from "../../lib/auth";
import styles from "./style.module.scss";
import Link from "next/link";
import UserMenu from "../UserMenu/index";

const Mheader = () => {
  const user = useAuth();
  const [waiting, setWaiting] = useState<boolean>(false);

  const signIn = () => {
    setWaiting(true);

    login()
      .catch((error) => {
        console.error(error?.code);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  return (
    <ul className={styles.menubox}>
      <Link href="/">
        <li className={styles.logo}>ロゴ</li>
      </Link>
      <div className={styles.login}>
        {user === null && !waiting && <p onClick={signIn}>ログイン</p>}
      </div>
      <div className={styles.icon}>{user && <UserMenu />} </div>
    </ul>
  );
};

export default Mheader;

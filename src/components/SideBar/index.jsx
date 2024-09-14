import React from "react";
import styles from "./style.module.scss";
import Link from "next/link";

const SideBar = () => {
  return (
    <div className={styles.sideBar}>
      {/*  */}
      <ul className={styles.menu}>
        <li>
          <Link href="/kanrigamen_pgae">公開一覧</Link>
        </li>
        <li>
          <Link href="/customer">非公開一覧</Link>
        </li>
        <li>
          <Link href="/logout">ログアウト</Link>
        </li>
      </ul>
      {/*  */}
    </div>
  );
};

export default SideBar;

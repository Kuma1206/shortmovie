import React from "react";
import styles from "./style.module.scss";
import Link from "next/link";

const C_footer = () => {
  return (
    <ul className={styles.menubox}>
      <Link href={"/"}>
        <li>ホーム</li>
      </Link>
      <Link href={"/seisaku_page"}>
        <li>動画制作</li>
      </Link>{" "}
      <Link href={"/mypage"}>
        <li>マイページ</li>
      </Link>
    </ul>
  );
};

export default C_footer;

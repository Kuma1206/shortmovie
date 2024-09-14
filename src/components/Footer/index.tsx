import React from "react";
import styles from "./style.module.scss";
import Link from "next/link";

const Footer = () => {
  return (
    <ul className={styles.menubox}>
      <Link href={"/"}>
        <li>ホーム</li>
      </Link>
      <li>お気に入り</li>
      <Link href={"/mypage"}>
        <li>マイページ</li>
      </Link>
    </ul>
  );
};

export default Footer;

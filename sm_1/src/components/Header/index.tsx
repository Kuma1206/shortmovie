import React from "react";
import styles from "./style.module.scss";

const Header = () => {
  return (
    <ul className={styles.menubox}>
      <li>ロゴ</li>
      <li>メニュー1</li>
      <li>メニュー2</li>
      <li>メニュー3</li>
    </ul>
  );
};

export default Header;

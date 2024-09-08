import React from 'react'
import styles from "./style.module.scss";
import Link from "next/link";

const Odaiidhiran = () => {
  return (
    <div className={styles.mainbox}>
      <Link href={"/shinario_sakusei"} className={styles.movebox}>
        <div>テスト3</div>
      </Link>{" "}
      <div className={styles.movebox}>テスト3</div>
      <div className={styles.movebox}>テスト3</div>
      <div className={styles.movebox}>テスト3</div>
      <div className={styles.movebox}>テスト3</div>
      <div className={styles.movebox}>テスト3</div>
      <div className={styles.movebox}>テスト3</div>
    </div>
  );
}

export default Odaiidhiran;

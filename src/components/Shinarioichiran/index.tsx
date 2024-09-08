import React from 'react'
import styles from "./style.module.scss";
import Link from "next/link";

const Shinarioichiran = () => {
  return (
    <div className={styles.mainbox}>
      <Link href={"/ahureco_sakusei"} className={styles.movebox}>
        <div>テスト4</div>
      </Link>{" "}
      <div className={styles.movebox}>テスト4</div>
      <div className={styles.movebox}>テスト4</div>
      <div className={styles.movebox}>テスト4</div>
      <div className={styles.movebox}>テスト4</div>
      <div className={styles.movebox}>テスト4</div>
      <div className={styles.movebox}>テスト4</div>
    </div>
  );
}

export default Shinarioichiran;
import React from 'react'
import styles from "./style.module.scss";
import Link from "next/link";

const Dougaichiran = () => {
  return (
    <div className={styles.mainbox}>
      <Link href={"/shinario_sakusei"} className={styles.movebox}>
        <div>テスト2</div>
      </Link>
      <div className={styles.movebox}>テスト2</div>
      <div className={styles.movebox}>テスト2</div>
      <div className={styles.movebox}>テスト2</div>
      <div className={styles.movebox}>テスト2</div>
      <div className={styles.movebox}>テスト2</div>
      <div className={styles.movebox}>テスト2</div>
    </div>
  );
}

export default Dougaichiran

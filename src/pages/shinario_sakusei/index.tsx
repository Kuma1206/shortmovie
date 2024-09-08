import React from "react";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";

const Shinario_sakusei = () => {
  return (
    <>
      <div className={styles.moviebox}>動画再生</div>
      <Link href="/seisaku_page">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
      <main className={styles.mainbox1}>
        <div className={styles.shokaiarea}>
          <p className={styles.serihubox1}>セリフ入力</p>
          <div className={styles.inputbox}>
            <input
              className={styles.serihubox2}
              type="text"
              placeholder="太郎：こんにちは！"
            />
            <p className={styles.saisei}>→</p>
          </div>
          <div className={styles.hozonbox}>
            <button className={styles.hozon}>保存</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Shinario_sakusei;

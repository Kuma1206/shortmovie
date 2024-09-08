import React from "react";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";

const Shinario_seisaku = () => {
  return (
    <>
      <div className={styles.moviebox}>動画再生</div>
      <Link href="/seisaku_page">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
      <main className={styles.mainbox1}>
        <div className={styles.shokaiarea}>
          <p className={styles.serihubox1}>録音</p>
          <div className={styles.inputbox}>

          </div>
          <div className={styles.hozonbox}>
            <button className={styles.hozon}>保存</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Shinario_seisaku;

import React from "react";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";

const Shinario_seisaku = () => {
  return (
    <>
      <div className={styles.moviebox}>動画再生</div>
      <Link href={"/seisaku_page"}>
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
      <main className={styles.mainbox1}>
        <div className={styles.shokaiarea}>
          <p>title</p>
          <p>エピソード数</p>
          <button className={styles.saisei}>▶ 再生</button>
          <p>動画紹介文</p>
        </div>
      </main>
    </>
  );
};

export default Shinario_seisaku;

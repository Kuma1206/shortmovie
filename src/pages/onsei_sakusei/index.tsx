import React from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";

const Onsei_sakusei = () => {
  const router = useRouter();
  const { videoUrl } = router.query; // クエリパラメータから動画URLを取得

  return (
    <>
      <div className={styles.moviebox}>
        {videoUrl ? ( // 動画URLが存在する場合のみ再生
          <video controls width="100%" controlsList="nodownload">
            <source src={videoUrl as string} type="video/mp4" />
            お使いのブラウザは動画タグをサポートしていません。
          </video>
        ) : (
          <p>動画が選択されていません。</p>
        )}
      </div>
      <div className={styles.hozonbox}>
        <button className={styles.hozon}>保存</button>
      </div>
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
        </div>
      </main>
    </>
  );
};

export default Onsei_sakusei;

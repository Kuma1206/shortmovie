import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/client";
import Link from "next/link";

const Odaiidhiran = () => {
  const [videos, setVideos] = useState<string[]>([]); // 動画のURLを格納するステート

  useEffect(() => {
    // Firestoreから動画URLを取得する関数
    const fetchVideos = async () => {
      const querySnapshot = await getDocs(collection(db, "videos"));
      const videoURLs = querySnapshot.docs.map((doc) => doc.data().url);
      setVideos(videoURLs); // 取得したURLをステートに保存
    };

    fetchVideos(); // コンポーネントがレンダリングされたときに動画を取得
  }, []);

  return (
    <div className={styles.mainbox}>
      {/* <Link href={"/shinario_sakusei"} className={styles.movebox}>
        <div>テスト3</div>
      </Link>{" "} */}
      {/* 取得した動画を movebox に表示 */}
      {videos.map((videoSrc, index) => (
        <Link
          href={{
            pathname: "/onsei_sakusei2",
            query: { videoUrl: videoSrc }, // 動画URLをクエリパラメータとして渡す
          }}
          key={index}
          className={styles.movebox}
        >
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <video
              controlsList="nodownload"
              width="100%"
              height="100%"
              style={{ pointerEvents: "none", objectFit: "cover" }} // はみ出た部分を隠し、枠内に収める
            >
              <source src={videoSrc} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Odaiidhiran;

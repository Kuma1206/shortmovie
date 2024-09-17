import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/client";
import Link from "next/link";

const Odaiidhiran = () => {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "videos"), (snapshot) => {
      const videoURLs = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Firestore data:", data); // 取得したデータを確認
        return data.url;
      });

      // Firestoreデータが更新されたことをログで確認
      console.log("Filtered video URLs:", videoURLs.filter(Boolean));
      setVideos(videoURLs.filter(Boolean)); // 無効なURLを除外してセット
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {videos.length > 0 ? (
        <div className={styles.mainbox}>
          {videos
            .filter((videoSrc) => videoSrc && videoSrc.trim() !== "") // 空のリンクをフィルタ
            .map((videoSrc, index) => (
              <Link
                href={{
                  pathname: "/onsei_sakusei2",
                  query: { videoUrl: videoSrc },
                }}
                key={index}
                className={styles.movebox}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <video
                    controlsList="nodownload"
                    width="100%"
                    height="100%"
                    style={{ pointerEvents: "none", objectFit: "cover" }}
                  >
                    <source src={videoSrc} type="video/mp4" />
                    お使いのブラウザは動画タグをサポートしていません。
                  </video>
                </div>
              </Link>
            ))}
        </div>
      ) : (
        <p>動画がありません。</p>
      )}
    </>
  );
};

export default Odaiidhiran;

import React, { useState, useEffect, useRef } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/client"; // Firebase初期化コード
import styles from "./style.module.scss";
import Link from "next/link";

const firestore = getFirestore(app);
const auth = getAuth(app);

const Dougaichiran = () => {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // ローディング状態
  const audioRefs = useRef<HTMLAudioElement[]>([]); // 複数の音声を参照するための配列

  useEffect(() => {
    const fetchVideos = async (userId: string) => {
      try {
        const audioCollectionRef = collection(
          firestore,
          `users/${userId}/audio`
        );
        const audioDocs = await getDocs(audioCollectionRef);

        const videoData = audioDocs.docs.map((doc) => doc.data());
        setVideoList(videoData);
        setLoading(false); // データ取得完了
      } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        setLoading(false); // エラー時もローディングを解除
      }
    };

    // 認証状態が変化するたびに呼び出される
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ユーザーがログインしている場合
        fetchVideos(user.uid);
      } else {
        // ユーザーがログインしていない場合
        console.error("ユーザーが認証されていません");
        setLoading(false); // ローディングを解除
      }
    });

    return () => unsubscribe(); // コンポーネントがアンマウントされたときにリスナーを解除
  }, []);

  const handlePlay = (index: number) => {
    // video 再生時に対応する audio を再生
    if (audioRefs.current[index]) {
      audioRefs.current[index].play();
    }
  };

  const handlePause = (index: number) => {
    // video 停止時に対応する audio も停止
    if (audioRefs.current[index]) {
      audioRefs.current[index].pause();
    }
  };

  if (loading) {
    return <p>読み込み中...</p>; // ローディング表示
  }

  return (
    <div className={styles.mainbox}>
      {videoList.length > 0 ? (
        videoList.map((video, index) => (
          <Link
            href={{
              pathname: "/hozondougasaisei",
              query: { videoUrl: video.videoUrl, audioUrl: video.audioUrl }, // 動画と音声URLをクエリパラメータとして渡す
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
                onPlay={() => handlePlay(index)} // 再生時に音声を再生
                onPause={() => handlePause(index)} // 停止時に音声を停止
              >
                <source src={video.videoUrl} type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
              <audio
                ref={(el) => {
                  audioRefs.current[index] = el!;
                }} // 各音声要素を配列に参照
              >
                <source src={video.audioUrl} type="audio/wav" />
                お使いのブラウザは音声タグをサポートしていません。
              </audio>
            </div>
          </Link>
        ))
      ) : (
        <p>動画がまだ保存されていません。</p>
      )}
    </div>
  );
};

export default Dougaichiran;

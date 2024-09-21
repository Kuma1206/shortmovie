import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Firestoreの関数をインポート
import { db } from "@/firebase/client"; // Firebase初期化設定をインポート
import WebAudioPlayer from "@/components/WebAudioPlayer/index."; // WebAudioPlayerをインポート

const Usersityougamen = () => {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const { videoUrl, audioUrl, audioId } = router.query; // クエリパラメータから音声IDも取得
  const videoRef = useRef<HTMLVideoElement>(null); // video要素を参照

  // FirestoreからisPublicを取得してトグルの初期値を設定
  useEffect(() => {
    if (router.isReady && audioId) {
      const fetchIsPublic = async () => {
        try {
          const audioDocRef = doc(db, "user_audio", audioId as string);
          const audioDoc = await getDoc(audioDocRef);
          if (audioDoc.exists()) {
            const data = audioDoc.data();
            setChecked(data.isPublic || false); // FirestoreのisPublicの値を設定
          }
        } catch (error) {
          console.error(
            "FirestoreからisPublicを取得する際にエラーが発生しました:",
            error
          );
        }
      };

      fetchIsPublic();
    }
  }, [router.isReady, audioId]); // router.isReadyがtrueになったときに実行

  // トグルの変更時に呼び出される関数
  const handleToggleChange = async () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (audioId) {
      try {
        const audioDocRef = doc(db, "user_audio", audioId as string);
        await updateDoc(audioDocRef, {
          isPublic: newChecked,
        });
        console.log("isPublicが正常に保存されました。");
      } catch (error) {
        console.error("Firestoreへの保存中にエラーが発生しました:", error);
      }
    } else {
      console.error("audioIdが存在しません。");
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      console.log("動画の再生位置:", videoRef.current.currentTime);
    }
  };

  return (
    <>
      <div className={styles.moviebox}>
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              controls
              width="100%"
              controlsList="nodownload"
              onTimeUpdate={handleTimeUpdate}
              playsInline
              muted={false}
            >
              <source src={videoUrl as string} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>

            {audioUrl ? (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  zIndex: 10,
                }}
              >
                <WebAudioPlayer audioUrl={audioUrl as string} />
              </div>
            ) : (
              <p>音声が選択されていません。</p>
            )}
          </>
        ) : (
          <p>動画が選択されていません。</p>
        )}
      </div>

      <Link href="/">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
    </>
  );
};

export default Usersityougamen;

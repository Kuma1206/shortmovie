import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Firestoreの関数をインポート
import { db } from "@/firebase/client"; // Firebase初期化設定をインポート

const Usersityougamen = () => {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const { videoUrl, audioUrl, audioId } = router.query; // クエリパラメータから音声IDも取得
  const videoRef = useRef<HTMLVideoElement>(null); // video要素を参照
  const audioRef = useRef<HTMLAudioElement>(null); // audio要素を参照

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

  const handlePlay = async () => {
    if (audioRef.current && videoRef.current) {
      console.log("Audio muted:", audioRef.current?.muted);
      console.log("Audio volume:", audioRef.current?.volume);

      try {
        audioRef.current.currentTime = videoRef.current.currentTime;
        await audioRef.current.play();
        audioRef.current.muted = false; // ミュートを解除
        console.log("音声の再生が開始されました。");
      } catch (error) {
        console.error("Audio play error:", error);
      }
    } else {
      console.error("audioRef.current または videoRef.current が null です。");
    }
  };

  const handlePause = () => {
    // 動画が停止されたときに音声も停止
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && videoRef.current) {
      console.log("動画の再生位置:", videoRef.current.currentTime);
      audioRef.current.currentTime = videoRef.current.currentTime;
      console.log("音声の再生位置を同期:", audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        console.log("音声ファイルのメタデータが正常に読み込まれました。");
      });
      audioRef.current.addEventListener("error", (e) => {
        console.error("音声ファイルの読み込み中にエラーが発生しました。:", e);
      });
    }
  }, [audioUrl]);

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
              onPlay={handlePlay}
              onPause={handlePause}
              onTimeUpdate={handleTimeUpdate}
              playsInline
              muted={false}
            >
              <source src={videoUrl as string} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>

            {audioUrl ? (
              <audio ref={audioRef} controls hidden>
                <source src={audioUrl as string} type="audio/wav" />
                お使いのブラウザは音声タグをサポートしていません。
              </audio>
            ) : (
              <p>音声が選択されていません。</p>
            )}
          </>
        ) : (
          <p>動画が選択されていません。</p>
        )}
      </div>
      {/* <div className={styles.hozonbox}>
        <button className={styles.hozon}>編集</button>
      </div> */}

      {/* <div className={styles.togglebox}>
        <span className={styles.title}>公開</span>
        <Toggle
          checked={checked}
          onChange={handleToggleChange}
          icons={false}
          className="react-toggle"
        />
      </div> */}

      <Link href="/">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
    </>
  );
};

export default Usersityougamen;

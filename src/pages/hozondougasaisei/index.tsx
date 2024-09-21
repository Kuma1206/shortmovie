import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/client";
import { deleteObject, ref } from "firebase/storage";

const Hozondougasaisei = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canAutoPlay, setCanAutoPlay] = useState(false);
  const [audioError, setAudioError] = useState(false); // オーディオエラー状態を追加
  const router = useRouter();
  const { userId, videoUrl, audioUrl, audioDocId, videoDocId } = router.query;
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // iOS Safariでのオーディオコンテキスト初期化
  useEffect(() => {
    const initAudioContext = () => {
      const audioContext = new AudioContext();
      audioContext
        .resume()
        .then(() => {
          setCanAutoPlay(true);
        })
        .catch((error) => {
          console.error("Failed to initialize audio context:", error);
          alert(
            `オーディオコンテキストの初期化に失敗しました: ${error.message}`
          );
          setAudioError(true); // エラー状態を設定
        });
    };

    document.addEventListener("touchstart", initAudioContext, { once: true });
    document.addEventListener("click", initAudioContext, { once: true });

    return () => {
      document.removeEventListener("touchstart", initAudioContext);
      document.removeEventListener("click", initAudioContext);
    };
  }, []);

  // バックグラウンド再生の設定
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setAttribute("playsinline", "");
      videoRef.current.setAttribute("webkit-playsinline", "");
    }
    if (audioRef.current) {
      audioRef.current.setAttribute("playsinline", "");
      audioRef.current.setAttribute("webkit-playsinline", "");
    }
  }, []);

  // FirestoreからisPublicを取得してトグルの初期値を設定
  useEffect(() => {
    const fetchIsPublic = async () => {
      if (!userId || !audioDocId) {
        setLoading(false);
        return;
      }

      try {
        const audioDocRef = doc(
          db,
          `user_audio/${userId}/audio`,
          audioDocId as string
        );
        const audioDoc = await getDoc(audioDocRef);
        if (audioDoc.exists()) {
          const data = audioDoc.data();
          setChecked(data?.isPublic || false);
        } else {
          console.error("指定されたドキュメントが存在しません。");
        }
      } catch (error) {
        console.error(
          "FirestoreからisPublicを取得する際にエラーが発生しました:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchIsPublic();
    }
  }, [router.isReady, userId, audioDocId]);

  // トグルの変更時に呼び出される関数
  const handleToggleChange = async () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (!userId || !audioDocId) {
      return;
    }

    try {
      const audioDocRef = doc(
        db,
        `user_audio/${userId}/audio`,
        audioDocId as string
      );
      await updateDoc(audioDocRef, { isPublic: newChecked });
    } catch (error) {
      console.error("Firestoreへの保存中にエラーが発生しました:", error);
    }
  };

  // 再生と一時停止の処理
  const handlePlay = () => {
    if (videoRef.current && audioRef.current && canAutoPlay) {
      audioRef.current.currentTime = videoRef.current.currentTime;
      audioRef.current.play().catch((error) => {
        setAudioError(true);
        alert("音声再生エラー: " + error.message);
      });
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleAudioError = (
    event: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    alert(`音声の読み込み中にエラーが発生しました: ${event}`);
  };

  const handleCanPlayThrough = () => {
    console.log("音声が再生可能です");
  };

  // 音声ファイルとFirestoreのドキュメントを削除する関数
  const handleDeleteAudio = async () => {
    const confirmation = window.confirm("削除しますか？");

    if (confirmation && userId && audioDocId && audioUrl) {
      try {
        const audioRefInStorage = ref(storage, audioUrl as string);
        await deleteObject(audioRefInStorage);

        const audioDocRef = doc(
          db,
          `user_audio/${userId}/audio`,
          audioDocId as string
        );
        await deleteDoc(audioDocRef);

        const videoDocRef = doc(db, "videos", videoDocId as string);
        await deleteDoc(videoDocRef);

        alert("削除しました");
        router.push("/seisaku_page2");
      } catch (error) {
        console.error("音声データの削除中にエラーが発生しました:", error);
      }
    }
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return (
    <>
      <div className={styles.moviebox}>
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              controls
              width="100%"
              muted
              playsInline
              controlsList="nodownload"
              onPlay={handlePlay}
              onPause={handlePause}
            >
              <source src={videoUrl as string} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>

            {audioUrl && (
              <audio
                ref={audioRef}
                controls
                hidden
                onError={handleAudioError}
                onCanPlayThrough={handleCanPlayThrough}
              >
                <source src={audioUrl as string} type="audio/mp3" />
                お使いのブラウザは音声タグをサポートしていません。
              </audio>
            )}
          </>
        ) : (
          <p>動画が選択されていません。</p>
        )}
      </div>

      <div className={styles.togglebox}>
        <span className={styles.title}>公開</span>
        <Toggle
          checked={checked}
          onChange={handleToggleChange}
          icons={false}
          className="react-toggle"
        />
      </div>

      {/* <div className={styles.sakujobox}>
        <button className={styles.sakujo} onClick={handleDeleteAudio}>
          削除
        </button>
      </div> */}

      <Link href="/seisaku_page2">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
    </>
  );
};

export default Hozondougasaisei;

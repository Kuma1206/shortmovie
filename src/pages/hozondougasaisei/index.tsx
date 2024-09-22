import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore"; // Firestoreの関数をインポート
import { db, storage } from "@/firebase/client"; // Firebase初期化設定をインポート
import { deleteObject, ref } from "firebase/storage";

const Hozondougasaisei = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userId, videoUrl, videoDocId } = router.query; // クエリパラメータからuserIdとvideoDocIdを取得
  const videoRef = useRef<HTMLVideoElement>(null); // video要素を参照

  // FirestoreからisPublicを取得してトグルの初期値を設定
  useEffect(() => {
    const fetchIsPublic = async () => {
      if (!userId || !videoDocId) {
        console.error("userId または videoDocId が存在しません。");
        setLoading(false);
        return;
      }

      try {
        console.log(
          `Fetching document for userId: ${userId}, videoDocId: ${videoDocId}`
        );
        const videoDocRef = doc(
          db,
          `user_videos/${userId}/videos`,
          videoDocId as string
        );
        const videoDoc = await getDoc(videoDocRef);
        if (videoDoc.exists()) {
          const data = videoDoc.data();
          setChecked(data?.isPublic || false); // Firestoreの値を使用
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
  }, [router.isReady, userId, videoDocId]);

  // トグルの変更時に呼び出される関数
  const handleToggleChange = async () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (!userId || !videoDocId) {
      console.error("userIdまたはvideoDocIdが存在しません。");
      return;
    }

    try {
      const videoDocRef = doc(
        db,
        `user_videos/${userId}/videos`,
        videoDocId as string
      );
      await updateDoc(videoDocRef, { isPublic: newChecked });
      console.log("isPublicが正常に保存されました。");
    } catch (error) {
      console.error("Firestoreへの保存中にエラーが発生しました:", error);
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // 動画の再生位置をリセット
      videoRef.current.play();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // 動画ファイルとFirestoreのドキュメントを削除する関数
  const handleDeleteVideo = async () => {
    const confirmation = window.confirm("削除しますか？");

    if (confirmation && userId && videoDocId && videoUrl) {
      try {
        // Firebase Storageから動画ファイルを削除
        const videoRefInStorage = ref(storage, videoUrl as string);
        await deleteObject(videoRefInStorage);

        // Firestoreから動画データを削除
        const videoDocRef = doc(
          db,
          `user_videos/${userId}/videos`,
          videoDocId as string
        );
        await deleteDoc(videoDocRef);

        console.log("動画データが正常に削除されました。");
        alert("削除しました");

        // ページをリダイレクト
        router.push("/seisaku_page2");
      } catch (error) {
        console.error("動画データの削除中にエラーが発生しました:", error);
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
              controlsList="nodownload"
              onPlay={handlePlay}
              onPause={handlePause}
            >
              <source src={videoUrl as string} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>
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

      <div className={styles.sakujobox}>
        <button className={styles.sakujo} onClick={handleDeleteVideo}>
          削除
        </button>
      </div>

      <Link href="/seisaku_page2">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
    </>
  );
};

export default Hozondougasaisei;

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
  const [loading, setLoading] = useState(true); // ローディング状態を追加
  const router = useRouter();
  const { userId, videoUrl, audioUrl, audioDocId, videoDocId } = router.query; // クエリパラメータからuserId, audioDocId, videoDocIdを取得
  const videoRef = useRef<HTMLVideoElement>(null); // video要素を参照
  const audioRef = useRef<HTMLAudioElement>(null); // audio要素を参照

  // FirestoreからisPublicを取得してトグルの初期値を設定
  useEffect(() => {
    const fetchIsPublic = async () => {
      // userIdとaudioDocIdがない場合の早期リターン
      if (!userId || !audioDocId) {
        console.error("userId または audioDocId が存在しません。");
        setLoading(false); // ローディングを解除
        return;
      }

      try {
        console.log(
          `Fetching document for userId: ${userId}, audioDocId: ${audioDocId}`
        );
        const audioDocRef = doc(
          db,
          `user_audio/${userId}/audio`,
          audioDocId as string
        );
        const audioDoc = await getDoc(audioDocRef);
        if (audioDoc.exists()) {
          const data = audioDoc.data();
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
        setLoading(false); // 最終的にローディングを解除
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

    // userIdとaudioDocIdがない場合の早期リターン
    if (!userId || !audioDocId) {
      console.error("userIdまたはaudioDocIdが存在しません。");
      return;
    }

    try {
      const audioDocRef = doc(
        db,
        `user_audio/${userId}/audio`,
        audioDocId as string
      );
      await updateDoc(audioDocRef, { isPublic: newChecked });
      console.log("isPublicが正常に保存されました。");
    } catch (error) {
      console.error("Firestoreへの保存中にエラーが発生しました:", error);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("音声の再生がブロックされました:", error);
        alert("音声を再生するには、画面をタップしてください。");
      });
    }
  };

  const handlePause = () => {
    // 動画が停止されたときに音声も停止
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // 音声ファイルとFirestoreのドキュメントを削除する関数
  const handleDeleteAudio = async () => {
    // 削除確認アラートを表示
    const confirmation = window.confirm("削除しますか？");

    // ユーザーが削除を確認した場合のみ削除処理を実行
    if (confirmation) {
      if (userId && audioDocId && audioUrl) {
        try {
          // Firebase Storageから音声ファイルを削除
          const audioRefInStorage = ref(storage, audioUrl as string);
          await deleteObject(audioRefInStorage);

          // Firestoreから音声データを削除
          const audioDocRef = doc(
            db,
            `user_audio/${userId}/audio`,
            audioDocId as string
          );
          await deleteDoc(audioDocRef);

          // Firestoreから動画データも削除
          const videoDocRef = doc(db, "videos", videoDocId as string);
          await deleteDoc(videoDocRef);

          console.log("音声データと動画データが正常に削除されました。");

          // 削除成功後にアラートを表示
          alert("削除しました");

          // ページから音声表示を削除するために、routerを使ってリダイレクト
          router.push("/seisaku_page2");
        } catch (error) {
          console.error("音声データの削除中にエラーが発生しました:", error);
        }
      } else {
        console.log("userId, audioDocId または audioUrl が存在しません。");

        try {
          if (userId && audioDocId) {
            // Firestoreの音声データドキュメントのみを削除
            const audioDocRef = doc(
              db,
              `user_audio/${userId}/audio`,
              audioDocId as string
            );
            await deleteDoc(audioDocRef);

            // Firestoreから動画データも削除
            const videoDocRef = doc(db, "videos", videoDocId as string);
            await deleteDoc(videoDocRef);

            console.log(
              "Firestoreの音声ドキュメントと動画ドキュメントが削除されました。"
            );

            // Firestoreのデータが削除された場合にもアラートを表示
            alert("削除しました");
          }

          // 音声ファイルが存在しない場合も、ページをリダイレクトする
          router.push("/seisaku_page2");
        } catch (error) {
          console.error(
            "Firestoreのドキュメント削除中にエラーが発生しました:",
            error
          );
        }
      }
    }
  };

  if (loading) {
    return <p>読み込み中...</p>; // Firestoreからデータ取得中にローディング表示
  }

  return (
    <>
      <div className={styles.moviebox}>
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              controls
              playsInline
              width="100%"
              controlsList="nodownload"
              onPlay={handlePlay}
              onPause={handlePause}
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
        <button className={styles.sakujo} onClick={handleDeleteAudio}>
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

import React, { useState, useEffect, useRef } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/client"; // Firebase初期化コード
import styles from "./style.module.scss";
import Link from "next/link";
import WeuiClose2Outlined from "@/components/Backbutton";

const firestore = getFirestore(app);
const auth = getAuth(app);

interface VideoData {
  id: string;
  videoUrl: string;
  audioUrl: string;
  thumbnailUrl?: string; // サムネイルURLを追加
}

const Dougaichiran = () => {
  const [videoList, setVideoList] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true); // ローディング状態
  const audioRefs = useRef<HTMLAudioElement[]>([]); // 複数の音声を参照するための配列

  useEffect(() => {
    // videoListが更新されるたびにaudioRefsをクリア
    audioRefs.current = [];
  }, [videoList]);

  useEffect(() => {
    const fetchVideos = async (userId: string) => {
      // コレクションのパスを修正
      const audioCollectionRef = collection(
        firestore,
        `user_audio/${userId}/audio`
      );

      const unsubscribe = onSnapshot(audioCollectionRef, (snapshot) => {
        const videoData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as VideoData))
          .filter((data) => {
            // Firestoreからのリンクが削除されているか確認
            return data.videoUrl && data.audioUrl;
          });

        setVideoList(videoData); // 削除されたリンクはvideoListに含まれない
        setLoading(false); // ローディング完了
      });

      return () => unsubscribe();
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchVideos(user.uid);
      } else {
        setVideoList([]); // 空のリストをセット
        setLoading(false); // ローディングを解除
      }
    });

    return () => unsubscribe();
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

  const handleDelete = async (videoId: string) => {
    if (window.confirm("削除しますか？")) {
      try {
        const videoDocRef = doc(
          firestore,
          `user_audio/${auth.currentUser?.uid}/audio`,
          videoId
        );

        // FirestoreからaudioURLとvideoURLを削除
        await updateDoc(videoDocRef, {
          audioUrl: deleteField(),
          videoUrl: deleteField(),
        });

        // moveboxを削除
        const movebox = document.getElementById(`movebox-${videoId}`);
        if (movebox) {
          movebox.remove();
        }

        console.log("リンクとmoveboxが削除されました");
      } catch (error) {
        console.error("エラーが発生しました:", error);

        // moveboxを削除
        const movebox = document.getElementById(`movebox-${videoId}`);
        if (movebox) {
          movebox.remove();
        }
      }
    }
  };

  if (loading) {
    return <p>読み込み中...</p>; // ローディング表示
  }

  return (
    <div className={styles.mainbox}>
      {videoList.length > 0 ? (
        videoList.map((video, index) => (
          <div
            id={`movebox-${video.id}`}
            key={video.id}
            className={styles.movebox}
          >
            <Link
              href={{
                pathname: "/hozondougasaisei",
                query: {
                  videoUrl: video.videoUrl,
                  audioUrl: video.audioUrl,
                  userId: auth.currentUser?.uid, // userIdをクエリパラメータとして追加
                  audioDocId: video.id, // audioDocIdをクエリパラメータとして追加
                },
              }}
            >
              <div
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
              >
                <div
                  className={styles.backbutton}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(video.id);
                  }}
                >
                  <WeuiClose2Outlined />
                </div>

                {/* サムネイル表示 */}
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt="サムネイル"
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <p>サムネイルがありません</p>
                )}

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
          </div>
        ))
      ) : (
        <p>動画がまだ保存されていません。</p>
      )}
    </div>
  );
};

export default Dougaichiran;

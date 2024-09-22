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
  thumbnailUrl?: string; // サムネイルURLを追加
}

const Dougaichiran = () => {
  const [videoList, setVideoList] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async (userId: string) => {
      const videoCollectionRef = collection(
        firestore,
        `user_videos/${userId}/videos`
      );

      const unsubscribe = onSnapshot(videoCollectionRef, (snapshot) => {
        const videoData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as VideoData))
          .filter((data) => data.videoUrl); // videoUrl が存在するデータのみ取得

        setVideoList(videoData);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchVideos(user.uid);
      } else {
        setVideoList([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (videoId: string) => {
    if (window.confirm("削除しますか？")) {
      try {
        const videoDocRef = doc(
          firestore,
          `user_videos/${auth.currentUser?.uid}/videos`,
          videoId
        );

        // FirestoreからvideoUrlとthumbnailUrlを削除
        await updateDoc(videoDocRef, {
          videoUrl: deleteField(),
          thumbnailUrl: deleteField(), // サムネイルも削除
        });

        // moveboxを削除
        const movebox = document.getElementById(`movebox-${videoId}`);
        if (movebox) {
          movebox.remove();
        }

        console.log("リンクとmoveboxが削除されました");
      } catch (error) {
        console.error("エラーが発生しました:", error);

        const movebox = document.getElementById(`movebox-${videoId}`);
        if (movebox) {
          movebox.remove();
        }
      }
    }
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className={styles.mainbox}>
      {videoList.length > 0 ? (
        videoList.map((video) => (
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
                  userId: auth.currentUser?.uid, // userIdをクエリパラメータとして追加
                  videoDocId: video.id, // videoDocIdをクエリパラメータとして追加
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

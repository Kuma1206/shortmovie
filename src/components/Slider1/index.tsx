import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./style.module.scss";
import Link from "next/link";
import { db } from "@/firebase/client"; // Firebaseの初期化設定をインポート

const Slider1 = () => {
  const [videos, setVideos] = useState<any[]>([]); // 音声付き動画データを格納するステート
  const audioRefs = useRef<HTMLAudioElement[]>([]); // 複数の音声を参照するための配列

  useEffect(() => {
    const fetchAudioAndVideos = async () => {
      try {
        console.log("Fetching audio and video data...");

        // user_videos コレクションのすべてのユーザーUIDを取得
        const userVideosCollection = collection(db, "user_videos");
        const userDocs = await getDocs(userVideosCollection);

        const allPublicVideos: any[] = [];

        // 各ユーザーの videos サブコレクションを取得してフィルタリング
        for (const userDoc of userDocs.docs) {
          const userId = userDoc.id; // 各ユーザーのUID
          const videosCollectionRef = collection(
            db,
            `user_videos/${userId}/videos`
          );

          // videosサブコレクション内でisPublic == true のドキュメントを取得
          const videosQuery = query(
            videosCollectionRef,
            where("isPublic", "==", true)
          );
          const videoSnapshot = await getDocs(videosQuery);

          // 取得した公開ドキュメントをリストに追加
          videoSnapshot.forEach((doc) => {
            const videoData = doc.data();

            // Firestoreから取得したデータがnullまたは削除済みでないことを確認
            if (videoData.videoUrl && videoData.audioUrl) {
              allPublicVideos.push({
                videoUrl: videoData.videoUrl,
                audioUrl: videoData.audioUrl,
                thumbnailUrl: videoData.thumbnailUrl || videoData.videoUrl, // サムネイルがあればそれを使う、なければvideoUrlを使う
              });
            }
          });
        }

        // 公開されている動画をセット
        setVideos(allPublicVideos);
      } catch (error) {
        console.error("Error fetching audio and video data: ", error);
      }
    };

    fetchAudioAndVideos();
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

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className={styles.menubox}>
      <p className={styles.title1}>音声付き動画一覧</p>
      <Carousel responsive={responsive}>
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div key={index} className={styles.itembox}>
              <Link
                href={{
                  pathname: `/usersityougamen`,
                  query: {
                    videoUrl: video.videoUrl,
                    audioUrl: video.audioUrl,
                  },
                }}
              >
                <div className={styles.item}>
                  <video
                    src={video.videoUrl}
                    width="100%"
                    controls={false} // 動画のコントロールを無効にする
                    onPlay={() => handlePlay(index)} // 再生時に音声を再生
                    onPause={() => handlePause(index)} // 停止時に音声を停止
                    poster={video.thumbnailUrl} // サムネイルとしてポスターを表示
                  >
                    お使いのブラウザはvideoタグをサポートしていません。
                  </video>
                  <audio
                    ref={(el) => {
                      audioRefs.current[index] = el!;
                    }} // 各音声要素を配列に参照
                  >
                    <source src={video.audioUrl} type="audio/wav" />
                    <source src={video.audioUrl} type="audio/mp3" />
                    お使いのブラウザは音声タグをサポートしていません。
                  </audio>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>保存された動画がありません。</p>
        )}
      </Carousel>
    </div>
  );
};

export default Slider1;

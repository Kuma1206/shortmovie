import React, { useRef } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";

const Hozondougasaisei = () => {
  const router = useRouter();
  const { videoUrl, audioUrl } = router.query; // クエリパラメータから動画URLと音声URLを取得
  const videoRef = useRef<HTMLVideoElement>(null); // video要素を参照
  const audioRef = useRef<HTMLAudioElement>(null); // audio要素を参照

  const handlePlay = () => {
    // 動画が再生されたときに音声も最初から再生
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // 音声の再生位置を最初にリセット
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    // 動画が停止されたときに音声も停止
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const onPlayBoth = () => {
    // 動画と音声を同時に再生する関数
    if (videoRef.current && audioRef.current) {
      videoRef.current.play();
      audioRef.current.play();
    }
  };

  return (
    <>
      <div className={styles.moviebox}>
        {videoUrl ? ( // 動画URLが存在する場合のみ再生
          <>
            <video
              ref={videoRef}
              controls
              width="100%"
              controlsList="nodownload"
              onPlay={handlePlay} // 動画再生時に音声も再生
              onPause={handlePause} // 動画停止時に音声も停止
            >
              <source src={videoUrl as string} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>

            {audioUrl ? (
              // 音声URLが存在する場合のみaudioタグを表示
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
      <div className={styles.hozonbox}>
        <button className={styles.hozon}>編集</button>
      </div>

      {/* onPlayBoth 関数をボタンに関連付ける */}
      {/* <div className={styles.onseidougasaisei}>
        <button className={styles.onseidouga} onClick={onPlayBoth}>
          音声動画再生
        </button>
      </div> */}

      <Link href="/seisaku_page">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
    </>
  );
};

export default Hozondougasaisei;

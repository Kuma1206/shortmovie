import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";
import { FaMicrophone } from "react-icons/fa"; // マイクアイコンのためのライブラリ

const Shinario_sakusei = () => {
  const router = useRouter();
  const { videoUrl } = router.query; // クエリパラメータから動画URLを取得

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null); // マイクの音声ストリームの参照

const startRecording = async () => {
  try {
    // 型キャストを追加
    const permission = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });

    if (permission.state === "denied") {
      alert("マイクへのアクセスが拒否されています。設定から許可してください。");
      return;
    }

    // アクセスが許可されている場合は、録音を開始
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    audioStreamRef.current = audioStream;
    const recorder = new MediaRecorder(audioStream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      setAudioChunks((prev) => [...prev, event.data]);
    };

    recorder.start();
    setIsRecording(true); // 録音中の状態にする
  } catch (error) {
    console.error("マイクへのアクセスに失敗しました:", error);
    alert("マイクのアクセスに失敗しました。");
  }
};




  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false); // 録音停止の状態にする（アニメーションを消す）
    }
  };

  return (
    <>
      <div className={styles.moviebox}>
        {videoUrl ? (
          <video controls width="100%" controlsList="nodownload">
            <source src={videoUrl as string} type="video/mp4" />
            お使いのブラウザは動画タグをサポートしていません。
          </video>
        ) : (
          <p>動画が選択されていません。</p>
        )}
      </div>

      {/* 既存の保存ボタン */}
      <div className={styles.hozonbox}>
        <button className={styles.hozon}>保存</button>
      </div>

      {/* 録音開始・停止用のマイクアイコンとアニメーション */}
      <div
        className={styles.microphoneIconContainer}
        onClick={isRecording ? stopRecording : startRecording} // アイコン部分やアニメーションをクリックで録音停止/開始
      >
        <div className={isRecording ? styles.recordingIndicator : ""}>
          <FaMicrophone className={styles.microphoneIcon} />
        </div>
      </div>

      <Link href="/seisaku_page">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>

      <main className={styles.mainbox1}></main>
    </>
  );
};

export default Shinario_sakusei;

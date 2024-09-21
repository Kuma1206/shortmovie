import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";
import { FaMicrophone } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { app } from "@/firebase/client"; // Firebaseの初期化コードをインポート
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

const ffmpeg = new FFmpeg();
const Onsei_sakusei2 = () => {
  const router = useRouter();
  const { videoUrl } = router.query;
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecording = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("録音を開始するにはログインが必要です。");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm", // webm形式に変更
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
          }
          console.log("録音データ:", audioBlob);
        } else {
          console.error("録音データが空です");
        }
      };

      mediaRecorder.start();
      console.log("録音を開始しました");
      setIsRecording(true);

      if (videoRef.current) {
        videoRef.current.play();
      }
    } catch (err) {
      console.error("マイクアクセスエラー:", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      console.log("録音を停止しました");
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsRecording(false);
  };

  // サムネイルをキャプチャする関数
  const captureThumbnail = async () => {
    if (!videoRef.current) return null;

    const videoElement = videoRef.current;
    return new Promise<string | null>((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const ctx = canvas.getContext("2d");

      // 動画の1秒後にフレームをキャプチャ
      videoElement.currentTime = 1;

      const handleSeeked = () => {
        if (ctx) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        } else {
          reject("Canvas context not available");
        }
        videoElement.removeEventListener("seeked", handleSeeked);
      };

      videoElement.addEventListener("seeked", handleSeeked);
    });
  };

  // サムネイルをFirebaseにアップロードする関数
  const uploadThumbnailToFirebase = async (thumbnailDataUrl: string) => {
    const user = auth.currentUser;
    if (!user) return null;

    const thumbnailFileName = `thumbnail_${Date.now()}.png`;
    const thumbnailStorageRef = ref(
      storage,
      `user_thumbnails/${user.uid}/${thumbnailFileName}`
    );

    const response = await fetch(thumbnailDataUrl);
    const blob = await response.blob();
    const snapshot = await uploadBytes(thumbnailStorageRef, blob);
    return getDownloadURL(snapshot.ref);
  };

  // 音声データをMP3に変換してFirebaseにアップロード
  const uploadAudioToFirebase = async (audioBlob: Blob) => {
    try {
      setIsSaving(true);

      const user = auth.currentUser;
      if (!user) {
        throw new Error("ユーザーが認証されていません");
      }

      const audioFileName = `audio_${Date.now()}.mp3`;
      const audioStorageRef = ref(
        storage,
        `user_audio/${user.uid}/${audioFileName}`
      );

      const snapshot = await uploadBytes(audioStorageRef, audioBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // サムネイルをキャプチャしてFirebaseにアップロード
      const thumbnailDataUrl = await captureThumbnail();
      const thumbnailUrl = await uploadThumbnailToFirebase(
        thumbnailDataUrl || ""
      );

      const audioCollectionRef = collection(
        firestore,
        `user_audio/${user.uid}/audio`
      );

      await addDoc(audioCollectionRef, {
        videoUrl,
        audioUrl: downloadURL,
        thumbnailUrl,
        createdAt: Date.now(),
        isPublic: true,
      });

      console.log(
        "音声とサムネイルがFirebaseに新規保存されました:",
        downloadURL
      );
      alert("音声とサムネイルが保存されました！");
    } catch (err) {
      console.error("音声の保存中にエラーが発生しました:", err);
      alert("エラーが発生しました。もう一度やり直してください。");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAudio = () => {
    if (audioChunksRef.current.length === 0) {
      console.error("保存できる音声データがありません");
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/webm",
    });
    uploadAudioToFirebase(audioBlob);
  };

  const playAudioWithVideo = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.play();
      videoRef.current.play();
    }
  };

  return (
    <>
      <div className={styles.moviebox}>
        {videoUrl ? (
          <video
            ref={videoRef}
            controls
            width="100%"
            controlsList="nodownload"
            crossOrigin="anonymous"
            onEnded={stopRecording}
          >
            <source src={videoUrl as string} type="video/mp4" />
            お使いのブラウザは動画タグをサポートしていません。
          </video>
        ) : (
          <p>動画が選択されていません。</p>
        )}
      </div>

      <audio ref={audioRef} controls hidden />

      <div
        className={styles.microphoneIconContainer}
        onClick={() => {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }}
      >
        <div className={isRecording ? styles.recordingIndicator : ""}>
          <FaMicrophone className={styles.microphoneIcon} />
        </div>
      </div>

      <div className={styles.box}>
        <div className={styles.onseisaiseibox}>
          <button className={styles.onseisaisei} onClick={playAudioWithVideo}>
            音声動画再生
          </button>
        </div>
      </div>
      <div
        className={styles.hozonbox}
        onClick={saveAudio}
        style={{ cursor: isSaving ? "not-allowed" : "pointer" }}
      >
        {isSaving ? "保存中..." : "保存"}
      </div>
      <Link href="/seisaku_page2">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
    </>
  );
};

export default Onsei_sakusei2;

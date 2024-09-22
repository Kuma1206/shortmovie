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
      videoElement.currentTime = 1; // 1秒後のフレームをキャプチャ

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

  // 動画と音声を結合する関数
  const mergeAudioVideo = async (audioBlob: Blob, videoUrl: string) => {
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    const audioFile = "audio.webm";
    const videoFile = "video.mp4";
    const outputFile = "output.mp4";

    const videoResponse = await fetch(videoUrl);
    const videoBlob = await videoResponse.blob();

    await ffmpeg.writeFile(videoFile, await fetchFile(videoBlob));
    await ffmpeg.writeFile(audioFile, await fetchFile(audioBlob));

    await ffmpeg.exec([
      "-i",
      videoFile,
      "-i",
      audioFile,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-strict",
      "experimental",
      outputFile,
    ]);

    const data = await ffmpeg.readFile(outputFile);
    const mergedBlob = new Blob([data], { type: "video/mp4" });

    return mergedBlob;
  };

  // 動画とサムネイルをFirebaseに保存
  const saveMergedVideoToFirebase = async (
    mergedBlob: Blob,
    thumbnailUrl: string
  ) => {
    try {
      setIsSaving(true);

      const user = auth.currentUser;
      if (!user) {
        throw new Error("ユーザーが認証されていません");
      }

      const mergedVideoFileName = `merged_video_${Date.now()}.mp4`;
      const mergedVideoRef = ref(
        storage,
        `user_videos/${user.uid}/${mergedVideoFileName}`
      );

      const snapshot = await uploadBytes(mergedVideoRef, mergedBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const videoCollectionRef = collection(
        firestore,
        `user_videos/${user.uid}/videos`
      );

      await addDoc(videoCollectionRef, {
        videoUrl: downloadURL,
        thumbnailUrl, // サムネイルURLをFirestoreに保存
        createdAt: Date.now(),
        isPublic: true,
      });

      console.log(
        "結合された動画とサムネイルがFirebaseに保存されました:",
        downloadURL
      );
      alert("結合された動画とサムネイルが保存されました！");
    } catch (err) {
      console.error("動画の保存中にエラーが発生しました:", err);
      alert("エラーが発生しました。もう一度やり直してください。");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAudio = async () => {
    if (audioChunksRef.current.length === 0) {
      console.error("保存できる音声データがありません");
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/webm",
    });

    // 1. サムネイルを先にキャプチャしてFirebaseに保存
    const thumbnailDataUrl = await captureThumbnail();
    const thumbnailUrl = await uploadThumbnailToFirebase(
      thumbnailDataUrl || ""
    );

    // 2. 音声と動画を結合
    const mergedBlob = await mergeAudioVideo(audioBlob, videoUrl as string);

    // 3. 結合された動画とサムネイルをFirebaseに保存
    if (thumbnailUrl !== null) {
      await saveMergedVideoToFirebase(mergedBlob, thumbnailUrl);
    } else {
      console.error("Thumbnail URL is null");
    }
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

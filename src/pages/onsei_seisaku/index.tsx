import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";
import { FaMicrophone } from "react-icons/fa";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { fetchFile } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";

const Onsei_seisaku = () => {
  const router = useRouter();
  const { videoUrl } = router.query;
  const auth = getAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // 保存完了を管理する状態
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const storage = getStorage();
  const firestore = getFirestore();

  useEffect(() => {
    const loadFFmpeg = async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpegInstance = new FFmpeg();
      await ffmpegInstance.load();
      setFFmpeg(ffmpegInstance);
    };

    loadFFmpeg();
  }, []);


  
const startRecording = async () => {
  if (!currentUser) {
    setErrorMessage("アカウントにログインしてください。");
    return;
  }

  // 録音開始前にaudioChunksをクリア
  setAudioChunks([]);

  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = "";
  }
  setAudioUrl(null);
  setErrorMessage("");

  try {
    // マイクアクセスの許可を直接要求する
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // MediaRecorderの初期化
    const options = { mimeType: "audio/webm;codecs=opus" };
    const recorder = new MediaRecorder(audioStream, options);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setAudioChunks((prev) => [...prev, event.data]);
      }
    };

    recorder.start();
    setIsRecording(true);

    if (videoRef.current) {
      videoRef.current.play();
    }
  } catch (error) {
    console.error("マイクへのアクセスに失敗しました:", error);
    alert("マイクのアクセスに失敗しました");
  }
};


  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);

      if (videoRef.current) {
        videoRef.current.pause();
      }

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      console.log("Audio Blob:", audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("Generated audio URL:", audioUrl);

      setAudioUrl(audioUrl);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.load();
      }

      if (videoRef.current && audioRef.current) {
        videoRef.current.currentTime = 0;
        audioRef.current.currentTime = 0;
        videoRef.current.play();
        audioRef.current.play();
      }
    }
  };

  // convertAudioToMp3関数を修正
  const convertAudioToMp3 = async (audioBlob: Blob): Promise<Blob | null> => {
    if (!ffmpeg) {
      console.error("FFmpeg is not loaded yet");
      return null;
    }

    // ブラウザ内で音声ファイルを変換
    await ffmpeg.writeFile("input.webm", await fetchFile(audioBlob));
    await ffmpeg.exec(["-i", "input.webm", "output.mp3"]);
    const mp3Data = await ffmpeg.readFile("output.mp3");
    // 変換後のファイルを Blob に変換
    const mp3Blob = new Blob([mp3Data], { type: "audio/mp3" });
    return mp3Blob;
  };

  const handleSave = async () => {
    if (!audioChunks.length || !videoUrl || !auth.currentUser?.uid) {
      console.log(
        "音声が録音されていない、または videoUrl やユーザーIDがありません。"
      );
      return;
    }

    try {
      setLoading(true); // ローディング開始

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

      // 音声ファイルを MP3 に変換
      const mp3Blob = await convertAudioToMp3(audioBlob);

      if (mp3Blob) {
        const audioFileRef = ref(
          storage,
          `user_audio/${auth.currentUser.uid}/${Date.now()}.mp3`
        );
        await uploadBytes(audioFileRef, mp3Blob);

        const audioDownloadUrl = await getDownloadURL(audioFileRef);

        const userDocRef = doc(firestore, "user_audio", auth.currentUser.uid);
        const data = {
          videoUrl: videoUrl || "", // videoUrlが空なら空文字列にフォールバック
          audioUrl: audioDownloadUrl, // 保存された音声のURL
          createdAt: Date.now(),
        };

        // Firestoreへの書き込み
        await setDoc(userDocRef, data);

        console.log("音声とメタデータを保存しました:", audioDownloadUrl);
        setIsSaved(true); // 保存成功ポップアップを表示

        setTimeout(() => {
          setIsSaved(false);
        }, 3000);
      } else {
        console.error("MP3 conversion failed");
        alert("音声の変換に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("Firestore 書き込みエラー:", error);
      alert("音声の保存中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    const audioElement = audioRef.current;

    if (videoElement && audioElement) {
      videoElement.addEventListener("play", () => {
        if (!isRecording && audioUrl) {
          audioElement.play().catch((error) => {
            console.error(
              "Audio playback failed due to browser restrictions:",
              error
            );
          });
        }
      });

      videoElement.addEventListener("pause", () => {
        audioElement.pause();
      });

      videoElement.addEventListener("seeked", () => {
        if (!isRecording) {
          audioElement.currentTime = videoElement.currentTime;
        }
      });
    }

    return () => {
      if (videoElement && audioElement) {
        videoElement.removeEventListener("play", () => audioElement.play());
        videoElement.removeEventListener("pause", () => audioElement.pause());
        videoElement.removeEventListener("seeked", () => {
          audioElement.currentTime = videoElement.currentTime;
        });
      }
    };
  }, [audioUrl, isRecording]);

  return (
    <>
      {/* ローディング画面 */}
      {loading && (
        <div className={styles.loadingScreen}>
          <p>音声を処理中...</p>
        </div>
      )}

      <div className={styles.moviebox}>
        {videoUrl ? (
          <video ref={videoRef} controls width="100%" controlsList="nodownload">
            <source src={videoUrl as string} type="video/mp4" />
            お使いのブラウザは動画タグをサポートしていません。
          </video>
        ) : (
          <p>動画が選択されていません。</p>
        )}
      </div>

      {audioUrl && (
        <div className={styles.audioPlayback}>
          <audio ref={audioRef} src={audioUrl} />
        </div>
      )}

      {/* 「リンク」ボタン */}
      {/* <button onClick={handleLinkButtonClick} className={styles.linkButton}>
        リンク
      </button> */}

      {/* 保存ボタン */}
      <button className={styles.hozonbutton} onClick={handleSave}>
        保存
      </button>

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

      {/* 保存完了ポップアップ */}
      {isSaved && (
        <div className={styles.popup}>
          <p>保存されました</p>
        </div>
      )}

      <Link href="/seisaku_page">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
    </>
  );
};

export default Onsei_seisaku;

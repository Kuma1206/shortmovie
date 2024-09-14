import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";
import { FaMicrophone } from "react-icons/fa";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const Shinario_sakusei = () => {
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
  const storage = getStorage();
  const firestore = getFirestore();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setErrorMessage("");
      } else {
        setCurrentUser(null);
      }
    });
  }, [auth]);

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
      const permission = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      if (permission.state === "denied") {
        alert(
          "マイクへのアクセスが拒否されています。設定から許可してください。"
        );
        return;
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const options = { mimeType: "audio/webm;codecs=opus" }; // 'audio/webm' のフォーマット
      const recorder = new MediaRecorder(audioStream, options);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        console.log("ondataavailable event:", event.data);
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
          console.log("Data added to audioChunks:", event.data);
        } else {
          console.log("Data size is 0, not adding to audioChunks.");
        }
      };

      recorder.start();
      setIsRecording(true);

      if (videoRef.current) {
        videoRef.current.play();
      }
    } catch (error) {
      console.error("マイクへのアクセスに失敗しました:", error);
      alert("マイクのアクセスに失敗しました。");
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

  const handleSave = async () => {
    console.log("Before saving, audioChunks:", audioChunks);

    if (!audioChunks.length || !videoUrl || !auth.currentUser?.uid) {
      console.log(
        "音声が録音されていない、または videoUrl やユーザーIDがありません。"
      );
      return;
    }

    try {
      setLoading(true); // ローディング開始

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioFileRef = ref(
        storage,
        `user_audio/${auth.currentUser.uid}/${Date.now()}.webm`
      );
      await uploadBytes(audioFileRef, audioBlob);

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
    } catch (error) {
      console.error("Firestore 書き込みエラー:", error);
      alert("音声の保存中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false); // ローディング終了
    }
  };


// const handleLinkButtonClick = async () => {
    //   // 既存のaudioChunksをクリアしない
    //   await startRecording();
    //   setTimeout(() => {
    //     stopRecording();
    //     if (videoRef.current) {
    //       videoRef.current.currentTime = 0; // 動画を0秒に戻す
    //     }
    //   }, 100); // 100ms後に録音を停止
    // };

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
        onClick={isRecording ? stopRecording : startRecording}
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

export default Shinario_sakusei;

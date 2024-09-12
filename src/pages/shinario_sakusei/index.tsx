import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";
import Link from "next/link";
import ReactPlayer from "react-player";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase Auth関連

const Shinario_sakusei = () => {
  const router = useRouter();
  const { videoUrl } = router.query;

  const [subtitles, setSubtitles] = useState<
    { text: string; startTime: number; endTime: number; isEditing: boolean }[]
  >([]); // 字幕の配列を管理
  const [currentText, setCurrentText] = useState(""); // 現在のテキストを管理
  const [currentTime, setCurrentTime] = useState(0); // 現在の動画の再生時間を管理
  const [isPlaying, setIsPlaying] = useState(false); // 動画の再生状態を管理

  // テキスト入力を管理
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentText(e.target.value);
  };

  // 字幕を追加
  const handleAddSubtitle = () => {
    setSubtitles([
      ...subtitles,
      {
        text: currentText,
        startTime: currentTime,
        endTime: currentTime + 3,
        isEditing: false, // 初期状態は編集モードではない
      },
    ]);
    setCurrentText("");
  };

  // 字幕表示をタイミングに基づいて行う
  const handleProgress = (playedSeconds: number) => {
    setCurrentTime(playedSeconds);
  };

  // 字幕をSRT形式に変換する関数
  const generateSRT = (
    subtitles: { text: string; startTime: number; endTime: number }[]
  ) => {
    return subtitles
      .map((subtitle, index) => {
        const startTime = formatTime(subtitle.startTime);
        const endTime = formatTime(subtitle.endTime);
        return `${index + 1}\n${startTime} --> ${endTime}\n${subtitle.text}\n`;
      })
      .join("\n");
  };

  // タイムフォーマット変換（00:00:01,000形式に変換）
  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const time = date.toISOString().substr(11, 8);
    return `${time},000`;
  };

  // クライアントサイドでAPIにリクエストを送信
  const handleSave = async () => {
    try {
      if (!videoUrl) {
        alert("動画が選択されていません");
        return;
      }

      // 字幕をSRT形式に変換
      const subtitlesSRT = generateSRT(subtitles);

      // APIにリクエストを送る
      const response = await fetch("/api/mergeVideo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoPath: videoUrl,
          subtitles: subtitlesSRT, // SRTデータを送信
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const mergedVideoUrl = data.outputPath;

        // Firebase Storageに保存
        const storage = getStorage();
        const storageRef = ref(storage, `videos/${Date.now()}_merged.mp4`);
        const videoBlob = await fetch(mergedVideoUrl).then((res) => res.blob());
        await uploadBytes(storageRef, videoBlob);

        // ダウンロードURLを取得
        const downloadURL = await getDownloadURL(storageRef);

        // Firestoreに保存
        const db = getFirestore();
        const auth = getAuth();
        const videoDocRef = doc(collection(db, "videos"));
        await setDoc(videoDocRef, {
          videoUrl: downloadURL,
          subtitles,
          userId: auth.currentUser?.uid, // ログインユーザーのIDを保存
        });

        alert("動画と字幕が正常に保存されました！");
      } else {
        console.error("結合エラー:", data.message);
      }
    } catch (error) {
      console.error("保存エラー:", error);
    }
  };

  // 字幕の開始時間と終了時間を調整
  const handleSubtitleTimeChange = (
    index: number,
    newStartTime: number,
    newEndTime: number
  ) => {
    const updatedSubtitles = subtitles.map((subtitle, i) =>
      i === index
        ? { ...subtitle, startTime: newStartTime, endTime: newEndTime }
        : subtitle
    );
    setSubtitles(updatedSubtitles);
  };

  // 現在の再生時間を字幕の開始または終了時間にセット
  const setCurrentTimeForSubtitle = (index: number, type: "start" | "end") => {
    const updatedSubtitles = subtitles.map((subtitle, i) =>
      i === index
        ? type === "start"
          ? { ...subtitle, startTime: currentTime }
          : { ...subtitle, endTime: currentTime }
        : subtitle
    );
    setSubtitles(updatedSubtitles);
  };

  // 字幕の編集モードをトグル
  const toggleEditMode = (index: number, isEditing: boolean) => {
    const updatedSubtitles = subtitles.map((subtitle, i) =>
      i === index ? { ...subtitle, isEditing } : subtitle
    );
    setSubtitles(updatedSubtitles);
  };

  // 字幕のテキストを編集
  const handleSubtitleEdit = (index: number, newText: string) => {
    const updatedSubtitles = subtitles.map((subtitle, i) =>
      i === index ? { ...subtitle, text: newText } : subtitle
    );
    setSubtitles(updatedSubtitles);
  };

  // 字幕の削除
  const handleDeleteSubtitle = (index: number) => {
    const updatedSubtitles = subtitles.filter((_, i) => i !== index);
    setSubtitles(updatedSubtitles);
  };

  return (
    <>
      <div className={styles.moviebox}>
        {videoUrl ? (
          <ReactPlayer
            url={videoUrl as string}
            controls
            width="100%"
            height="100%"
            onProgress={({ playedSeconds }) => handleProgress(playedSeconds)} // 現在の再生時間を取得
            onPlay={() => setIsPlaying(true)} // 再生時のステータス更新
            onPause={() => setIsPlaying(false)} // 一時停止時のステータス更新
            onEnded={() => setIsPlaying(false)} // 終了時のステータス更新
          />
        ) : (
          <p>動画が選択されていません。</p>
        )}
      </div>
      <div className={styles.hozonbox}>
        <button className={styles.hozon} onClick={handleSave}>
          保存
        </button>
      </div>
      <Link href="/seisaku_page">
        <WeuiClose2Outlined className={styles.backbutton} />
      </Link>
      <main className={styles.mainbox1}>
        <div className={styles.subtitleDisplay}>
          {subtitles.map((subtitle, index) => (
            <div
              key={index}
              className={styles.subtitleItem}
              style={{
                display: isPlaying
                  ? currentTime >= subtitle.startTime &&
                    currentTime <= subtitle.endTime &&
                    !(index > 0 && currentTime < 1.0) // 2つ目以降の字幕は1秒以内は非表示
                    ? "block"
                    : "none"
                  : "block", // 停止中・一時停止中は常に表示
              }}
            >
              {subtitle.isEditing ? (
                // 編集中のテキストフィールド
                <input
                  type="text"
                  value={subtitle.text}
                  onChange={(e) => handleSubtitleEdit(index, e.target.value)}
                  onBlur={() => toggleEditMode(index, false)} // フォーカスを外すと編集終了
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      toggleEditMode(index, false); // エンターボタンで編集終了
                    }
                  }}
                  className={styles.editableSubtitleInput}
                />
              ) : (
                // 通常の字幕表示
                <p onClick={() => toggleEditMode(index, true)}>
                  {subtitle.text}
                </p>
              )}

              {/* ×ボタンによる削除機能（再生中は非表示） */}
              {!isPlaying && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteSubtitle(index)}
                >
                  ×
                </button>
              )}

              {/* tbox（再生中は非表示） */}
              {!isPlaying && (
                <div className={styles.tbox}>
                  <div className={styles.timebox}>
                    <button
                      className={styles.setTimeButton}
                      onClick={() => setCurrentTimeForSubtitle(index, "start")}
                    >
                      START
                    </button>
                    <input
                      className={styles.startbox}
                      type="number"
                      value={subtitle.startTime}
                      onChange={(e) =>
                        handleSubtitleTimeChange(
                          index,
                          Number(e.target.value),
                          subtitle.endTime
                        )
                      }
                      step="0.1"
                    />
                    /秒
                  </div>
                  <div className={styles.timebox}>
                    <button
                      className={styles.setTimeButton}
                      onClick={() => setCurrentTimeForSubtitle(index, "end")}
                    >
                      END
                    </button>
                    <input
                      className={styles.endbox}
                      type="number"
                      value={subtitle.endTime}
                      onChange={(e) =>
                        handleSubtitleTimeChange(
                          index,
                          subtitle.startTime,
                          Number(e.target.value)
                        )
                      }
                      step="0.1"
                    />
                    /秒
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.shokaiarea}>
          <p className={styles.serihubox1}>セリフ入力</p>
          <div className={styles.inputbox}>
            <input
              className={styles.serihubox2}
              type="text"
              value={currentText}
              onChange={handleTextChange}
              placeholder="太郎：こんにちは！"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSubtitle(); // エンターボタンで字幕を追加
                }
              }}
            />
            <button className={styles.saisei} onClick={handleAddSubtitle}>
              →
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Shinario_sakusei;

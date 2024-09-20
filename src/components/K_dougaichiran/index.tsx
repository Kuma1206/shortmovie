import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { storage, db } from "../../firebase/client";
import styles from "./style.module.scss";
import WeuiClose2Outlined from "@/components/Backbutton";

const K_dougaichiran: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]); // 動画URLとサムネイルのステート
  const [userId, setUserId] = useState<string | null>(null); // ユーザーIDのステート
  const videoRef = useRef<HTMLVideoElement | null>(null); // 動画要素の参照

  // ユーザー認証の監視
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // 認証されたユーザーの UID をステートに保存
      } else {
        setUserId(null); // 認証されていない場合は null
      }
    });
    return () => unsubscribe(); // クリーンアップ
  }, []);

  // サムネイルキャプチャ関数
  const captureThumbnail = (
    captureTimeInSeconds: number = 1
  ): Promise<string | null> => {
    if (!videoRef.current) return Promise.resolve(null);

    return new Promise<string | null>((resolve, reject) => {
      const videoElement = videoRef.current;

      const handleTimeUpdate = () => {
        try {
          // 1秒後にフレームをキャプチャ
          const canvas = document.createElement("canvas");
          canvas.width = videoElement!.videoWidth;
          canvas.height = videoElement!.videoHeight;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(videoElement!, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
          } else {
            reject(new Error("Failed to get canvas context"));
          }
        } catch (error) {
          reject(new Error("サムネイルのキャプチャに失敗しました"));
        } finally {
          videoElement!.removeEventListener("timeupdate", handleTimeUpdate); // イベントリスナーを削除
        }
      };

      videoElement!.addEventListener("timeupdate", handleTimeUpdate, {
        once: true,
      });
      videoElement!.currentTime = captureTimeInSeconds; // 1秒後に移動してキャプチャ
    });
  };

  // Firebaseにサムネイルをアップロードする関数
  const uploadThumbnailToFirebase = async (thumbnailDataUrl: string) => {
    const user = getAuth().currentUser;
    if (!user) return;

    const thumbnailFileName = `thumbnail_${Date.now()}.png`;
    const thumbnailStorageRef = ref(
      storage,
      `user_thumbnails/${user.uid}/${thumbnailFileName}`
    );

    // サムネイル画像データをBlobに変換
    const response = await fetch(thumbnailDataUrl);
    const blob = await response.blob();

    // Firebase Storageにアップロード
    const snapshot = await uploadBytes(thumbnailStorageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  };

  // 動画が読み込まれた時点でサムネイルをキャプチャ
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!userId) {
        console.error("ユーザーが認証されていません");
        return;
      }

      acceptedFiles.forEach(async (file) => {
        try {
          const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);

          // Firebase Storage に動画をアップロード
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          console.log("ダウンロードURL: ", downloadURL);

          // 動画を設定してサムネイルキャプチャ
          if (videoRef.current) {
            videoRef.current.src = downloadURL;

            videoRef.current.onloadeddata = async () => {
              // 動画を自動で再生
              videoRef.current!.play();

              // 1秒後に動画を停止してサムネイルをキャプチャ
              setTimeout(async () => {
                videoRef.current!.pause(); // 1秒後に動画を停止
                const thumbnailDataUrl = await captureThumbnail(1); // サムネイルをキャプチャ

                let thumbnailUrl = null;
                if (thumbnailDataUrl) {
                  thumbnailUrl = await uploadThumbnailToFirebase(
                    thumbnailDataUrl
                  ); // サムネイルをFirebaseにアップロード
                }

                // Firestore に動画の URL と uploaderId、サムネイルURLを保存
                const docRef = await addDoc(collection(db, "videos"), {
                  url: downloadURL,
                  uploaderId: userId, // 認証されたユーザーのIDを保存
                  thumbnailUrl, // サムネイルURL
                  createdAt: new Date(), // 作成日時を保存
                });

                setVideos((prevVideos) => [
                  ...prevVideos,
                  { id: docRef.id, url: downloadURL, thumbnailUrl },
                ]); // 新しい動画URLをステートに追加
              }, 1000); // 1秒後にサムネイルをキャプチャ
            };
          }
        } catch (error) {
          console.error("動画のアップロードに失敗しました: ", error);
        }
      });
    },
    [userId] // userId を依存として追加
  );

  // Firestore から動画のダウンロードURLを取得する
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        // Firestoreから動画URLとサムネイルURLを取得してステートに保存
        const videoData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(videoData);
      } catch (error) {
        console.error("動画の取得に失敗しました: ", error);
      }
    };

    fetchVideos();
  }, []);

  // 動画とサムネイルの削除関数
  const handleDelete = async (
    videoId: string,
    videoUrl: string,
    thumbnailUrl: string
  ) => {
    if (window.confirm("削除しますか？")) {
      try {
        // Firestoreから動画とサムネイルのリンクを削除
        const docRef = doc(db, "videos", videoId);
        await deleteDoc(docRef);

        // Firebase Storageから動画を削除
        const videoStorageRef = ref(storage, videoUrl);
        await deleteObject(videoStorageRef).catch((error) => {
          console.warn("動画の削除に失敗しましたが、続行します:", error);
        });

        // Firebase Storageからサムネイルを削除
        if (thumbnailUrl) {
          const thumbnailStorageRef = ref(storage, thumbnailUrl);
          await deleteObject(thumbnailStorageRef).catch((error) => {
            console.warn(
              "サムネイルの削除に失敗しましたが、続行します:",
              error
            );
          });
        }

        // 画面から動画を削除
        setVideos((prevVideos) =>
          prevVideos.filter((video) => video.id !== videoId)
        );

        console.log("動画とサムネイルが削除されました");
      } catch (error) {
        console.error("削除に失敗しました: ", error);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/*": [], // 動画ファイルのみを許可
    },
    onDrop,
  });

  return (
    <div className={styles.mainbox}>
      {/* 動画アップロード用のボックス */}
      <div {...getRootProps({ className: styles.movebox })}>
        <input {...getInputProps()} />
        <p>＋</p>
      </div>

      {/* アップロードされた各動画を表示 */}
      {videos.map((video, index) => (
        <div key={index} className={styles.movebox}>
          <div
            className={styles.backbutton}
            onClick={() =>
              handleDelete(video.id, video.url, video.thumbnailUrl)
            }
          >
            <WeuiClose2Outlined />
          </div>
          <video ref={videoRef} controls width="100%" crossOrigin="anonymous">
            <source src={video.url} type="video/mp4" />
            お使いのブラウザはvideoタグをサポートしていません。
          </video>
        </div>
      ))}
    </div>
  );
};

export default K_dougaichiran;

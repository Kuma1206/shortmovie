import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { storage, db } from "../../firebase/client";
import styles from "./style.module.scss";

const K_dougaichiran: React.FC = () => {
  const [videos, setVideos] = useState<string[]>([]); // 動画URLのステート
  const [userId, setUserId] = useState<string | null>(null); // ユーザーIDのステート

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

  // 動画をアップロードし、Firebase StorageとFirestoreに保存
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

          // Firestore に動画の URL と uploaderId を保存
          await addDoc(collection(db, "videos"), {
            url: downloadURL,
            uploaderId: userId, // 認証されたユーザーのIDを保存
            createdAt: new Date(), // オプションで作成日時を保存
          });

          setVideos((prevVideos) => [...prevVideos, downloadURL]); // 新しい動画URLをステートに追加
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
        // Firestoreから動画URLを取得してステートに保存
        const videoURLs = querySnapshot.docs.map((doc) => doc.data().url);
        setVideos(videoURLs);
      } catch (error) {
        console.error("動画の取得に失敗しました: ", error);
      }
    };

    fetchVideos();
  }, []);

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
      {videos.map((videoSrc, index) => (
        <div key={index} className={styles.movebox}>
          <video controls width="100%">
            <source src={videoSrc} type="video/mp4" />
            お使いのブラウザは動画タグをサポートしていません。
          </video>
        </div>
      ))}
    </div>
  );
};

export default K_dougaichiran;

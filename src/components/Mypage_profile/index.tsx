import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import IcBaselineAccountBox from "@/components/Profileimage"; // デフォルトの画像コンポーネント
import Link from "next/link";
import { uploadProfileImage } from "../../firebase/client"; // 画像アップロード関数をインポート
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/client"; // Firebaseの初期化ファイルからインポート

const Mypage_profile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setProfileImage(userDoc.data().photoURL || null);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log("選択されたファイル:", file); // 選択されたファイルをコンソールに表示

    if (file) {
      try {
        console.log("アップロードを開始します:", file.name); // アップロード開始のログ
        const imageUrl = await uploadProfileImage(file); // 画像をアップロードし、URLを取得
        console.log("画像のアップロードに成功:", imageUrl); // アップロード成功時のURLを表示
        setProfileImage(imageUrl); // 画像URLを状態に設定

        // ユーザーのIDを取得
        const userId = auth.currentUser?.uid;

        // Firestoreに画像URLを保存
        if (userId) {
          await setDoc(
            doc(db, "users", userId),
            { photoURL: imageUrl },
            { merge: true }
          );
        }
      } catch (error) {
        console.error("画像のアップロードに失敗しました:", error); // エラーログ
      }
    } else {
      console.log("ファイルが選択されていません。"); // ファイルが選択されていない場合のログ
    }
  };

  return (
    <>
      <main className={styles.mainbox1}>
        <div className={styles.pbox}>
          <p
            className={styles.pimage}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className={styles.pimagebox2}
              />
            ) : (
              // profileImageが存在しない場合のみpimageboxを表示
              <IcBaselineAccountBox className={styles.pimagebox} />
            )}
          </p>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <div className={styles.psheet}>
            <p className={styles.ptext}>name：</p>
            <p className={styles.ptext}>自己紹介：</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Mypage_profile;

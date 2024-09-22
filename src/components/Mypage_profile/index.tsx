import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./style.module.scss";
import { uploadProfileImage } from "../../firebase/client";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/client";
import { useRouter } from "next/router";

const Mypage_profile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter(); // useRouter フックを使ってルーターを取得

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

    // ユーザーがログインしているか確認し、データを取得
    if (auth.currentUser) {
      fetchUserData(); // ログインしている場合、データを取得
    } else {
      router.push("/seisaku_page1"); // ログインしていない場合にリダイレクト
    }
  }, [router]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log("選択されたファイル:", file);

    if (file) {
      try {
        console.log("アップロードを開始します:", file.name);
        const imageUrl = await uploadProfileImage(file);
        console.log("画像のアップロードに成功:", imageUrl);
        setProfileImage(imageUrl);

        const userId = auth.currentUser?.uid;

        if (userId) {
          await setDoc(
            doc(db, "users", userId),
            { photoURL: imageUrl },
            { merge: true } // 既存のドキュメントにマージする場合
          );
        }
      } catch (error) {
        console.error("画像のアップロードに失敗しました:", error);
      }
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput")?.click();
  };

  return (
    <>
      <main className={styles.mainbox1}>
        <div className={styles.pbox}>
          {/* プロフィール画像の表示 */}
          {profileImage && (
            <p className={styles.pimage} onClick={handleClick}>
              <Image
                src={profileImage}
                alt="Profile"
                className={styles.pimagebox2}
                width={100} // 必須の width
                height={100} // 必須の height
              />
            </p>
          )}

          {/* ユーザー名の表示 */}
          {auth.currentUser && (
            <div className={styles.psheet}>
              <p className={styles.ptext}>NAME</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>
      </main>
    </>
  );
};

export default Mypage_profile;

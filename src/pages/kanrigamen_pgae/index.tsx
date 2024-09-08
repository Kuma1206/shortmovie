import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../firebase/client"; // Firebase 認証のインポート
import { onAuthStateChanged, User } from "firebase/auth"; // Firebase User 型のインポート
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore のインポート
import styles from "./style.module.scss";
import Kheader from "@/components/K_header";
import AdminRoute from "../../components/AdminRoute";

const KanrigamenPage = () => {
  // Firebase.User | null 型に変更
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ロード中の状態
  const router = useRouter();
  const db = getFirestore(); // Firestore インスタンス

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ユーザーがログインしているか確認
        const userDocRef = doc(db, "users", user.uid); // Firestore からユーザー情報を取得
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Firestore の isAdmin フィールドを確認
          if (userData.isAdmin === true) {
            setUser(user); // 管理者として認識
          } else {
            // 管理者でなければログインページにリダイレクト
            router.push("/k_login");
          }
        } else {
          console.error("ユーザードキュメントが見つかりません");
          router.push("/k_login");
        }
      } else {
        // 未ログイン状態の場合、ログインページにリダイレクト
        router.push("/k_login");
      }
      setLoading(false); // ロード完了
    });

    return () => unsubscribe();
  }, [router, db]);

  if (loading) {
    return <div>ロード中...</div>; // 認証状態を確認している間はローディング表示
  }

  if (!user) {
    return null; // ログインしていない場合は何も表示しない
  }

  return (
    <>
      <AdminRoute>
        <header>
          <Kheader />
        </header>
        <main className={styles.mainbox}></main>
      </AdminRoute> 
    </>
  );
};

export default KanrigamenPage;

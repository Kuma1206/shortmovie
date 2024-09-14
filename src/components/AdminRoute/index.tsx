import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

// AdminRouteのPropsを定義
interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    // Firebase Authの状態を監視
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        // 管理者権限があるかどうかを確認
        if (idTokenResult.claims.isAdmin) {
          setIsAdmin(true); // 管理者と判定
        } else {
          setIsAdmin(false); // 一般ユーザーと判定
        }
      } else {
        setIsAdmin(false); // 未認証状態
      }
    });

    return () => unsubscribe(); // クリーンアップ処理
  }, [auth]);

  useEffect(() => {
    if (isAdmin === false) {
      // 管理者でない場合、または未認証の場合はログインページへリダイレクト
      router.push("/k_login");
    } else if (isAdmin === true && router.pathname !== "/kanrigamen_pgae") {
      // 管理者が管理画面以外にアクセスした場合、管理画面へリダイレクト
      router.push("/kanrigamen_pgae");
    }
  }, [isAdmin, router]);

  // ローディング中の表示
  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  // 管理者の場合のみ子コンポーネントを表示
  return isAdmin ? <>{children}</> : null;
};

export default AdminRoute;

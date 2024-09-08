// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

const firebaseConfig = {

};

if (getApps().length === 0) {
  // Firebaseアプリの初期化
  initializeApp(firebaseConfig);
}

// プロフィール画像をアップロードして、URLを取得する関数
const uploadProfileImage = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("ファイルが指定されていません");
  }

  const storageRef = ref(storage, `profile_images/${file.name}`);
  
  try {
    await uploadBytes(storageRef, file); // 画像をストレージにアップロード
    const url = await getDownloadURL(storageRef); // ダウンロードURLを取得
    return url; // 画像のURLを返す
  } catch (error) {
    console.error("画像のアップロードに失敗しました:", error);
    
    // エラーハンドリング
    if (error instanceof Error) {
      console.error("エラーメッセージ:", error.message);
      if ((error as any).code) {
        console.error("エラーコード:", (error as any).code);
      }
    } else {
      console.error("予期しないエラー:", error);
    }
    
    throw error; // エラーをスロー
  }
};

// Firebase関連機能をエクスポート
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
export const functions = getFunctions(); // 必要に応じてリージョン指定も可能
export { uploadProfileImage };

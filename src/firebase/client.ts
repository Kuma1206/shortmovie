// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyC12os0qCgyZXVuQrJBZtiwJ-bBFGo94rE",
  authDomain: "osmproject-34e1b.firebaseapp.com",
  projectId: "osmproject-34e1b",
  storageBucket: "osmproject-34e1b.appspot.com",
  messagingSenderId: "668370771950",
  appId: "1:668370771950:web:a6b1652219e36aeb9078ff"
};

if (!getApps()?.length) {
  // Firebaseアプリの初期化
  initializeApp(firebaseConfig);
}

const uploadProfileImage = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("ファイルが指定されていません");
  }
  const storageRef = ref(storage, `profile_images/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url; // 画像のURLを返す
  } catch (error) {
    console.error("画像のアップロードに失敗しました:", error);
    
    // エラーがError型であるか確認
    if (error instanceof Error) {
      console.error("エラーメッセージ:", error.message);
      
      // error.codeが存在する場合のみ表示
      if ((error as any).code) {
        console.error("エラーコード:", (error as any).code);
      }
    } else {
      console.error("予期しないエラー:", error);
    }
    
    throw error; // エラーをスロー
  }
};


// 他ファイルで使うために機能をエクスポート
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
export const functions = getFunctions(); // 修正: `functions`のスペルミスを修正
export { uploadProfileImage }; // 画像アップロード関数をエクスポート

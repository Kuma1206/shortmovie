import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (getApps().length === 0) {
  // Firebaseアプリの初期化
  initializeApp(firebaseConfig);
}

// Firebase関連機能をエクスポート
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
export const functions = getFunctions(); // 必要に応じてリージョン指定も可能

// 画像をアップロードしてそのURLを返す関数を定義
export const uploadProfileImage = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `profile_images/${file.name}`);
  
  // Firebase Storage に画像をアップロード
  await uploadBytes(storageRef, file);

  // アップロードされた画像のダウンロードURLを取得
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};

/**
 * 動画をStorageから削除し、対応するFirestoreのドキュメントも削除する
 * @param {string} storagePath - Storageの動画パス
 * @param {string} firestoreDocPath - Firestoreのドキュメントパス
 */
export const deleteVideoAndDocument = async (storagePath: string, firestoreDocPath: string) => {
  const videoRef = ref(storage, storagePath);
  const docRef = doc(db, firestoreDocPath);

  try {
    // Storageから動画を削除
    await deleteObject(videoRef);
    console.log('Storageから動画を削除しました。');

    // Firestoreからドキュメントを削除
    await deleteDoc(docRef);
    console.log('Firestoreから対応するドキュメントを削除しました。');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    throw error;
  }
};

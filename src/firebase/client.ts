import { initializeApp, getApps, getApp } from 'firebase/app';
import { runTransaction, getDoc, getFirestore, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); 

// Firebase関連機能をエクスポート
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const functions = getFunctions(app); // 必要に応じてリージョン指定も可能

// プロフィール画像をアップロードし、そのURLを取得する関数
export const uploadProfileImage = async (file: File): Promise<string> => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("ユーザーが認証されていません。");
  }

  const storageRef = ref(storage, `profileImages/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Firestoreに動画データを確実に保存するためのトランザクション関数
export const saveVideoDataWithTransaction = async (
  userId: string,
  videoId: string,
  videoUrl: string,
  audioUrl: string
) => {
  try {
    const videoDocRef = doc(db, 'videos', videoId);

    await runTransaction(db, async (transaction) => {
      const videoDoc = await transaction.get(videoDocRef);
      
      if (!videoDoc.exists()) {
        // 新規ドキュメントを作成
        transaction.set(videoDocRef, {
          userId,
          videoUrl,
          audioUrl,
          status: 'ready',
          createdAt: Date.now(),
        });
      } else {
        // 既存のドキュメントを更新
        transaction.update(videoDocRef, {
          videoUrl,
          audioUrl,
          status: 'ready',
          updatedAt: Date.now(),
        });
      }
    });

    console.log('動画データがトランザクションで正常に保存されました。');
  } catch (error) {
    console.error('Firestoreトランザクション中にエラーが発生しました:', error);
    throw error;
  }
};

// 音声ファイルをアップロードし、そのURLを取得して Firestore に動画リンクとユーザー情報も保存
export const uploadAudioAndSaveUrl = async (
  file: File,
  userId: string,
  videoId: string,
  videoUrl: string
) => {
  try {
    // まず、準備中の状態でドキュメントを作成
    const videoDocRef = doc(db, 'videos', videoId);
    await setDoc(videoDocRef, {
      userId,
      status: 'preparing',
      createdAt: Date.now(),
    });

    // Upload audio file to Firebase Storage
    const audioFileName = `audio/${userId}/${Date.now()}_${file.name}`;
    const audioRef = ref(storage, audioFileName);
    
    await uploadBytes(audioRef, file);
    
    // Get the download URL of the uploaded file
    const audioUrl = await getDownloadURL(audioRef);
    
    console.log('Audio URL obtained:', audioUrl);

    // Save audio URL, video link, and update status
    try {
      await updateDoc(videoDocRef, {
        audioUrl: audioUrl,
        videoUrl: videoUrl,
        status: 'ready',
        updatedAt: Date.now(),
      });
      console.log('Audio URL, video link saved and status updated in Firestore');
    } catch (firestoreError) {
      console.error('Error saving audio information to Firestore:', firestoreError);
      throw firestoreError;
    }

    return audioUrl;
  } catch (error) {
    console.error('Error occurred while uploading audio:', error);
    // エラーが発生した場合、ドキュメントを削除または状態を「エラー」に更新
    try {
      await updateDoc(doc(db, 'videos', videoId), { status: 'error' });
    } catch (deleteError) {
      console.error('Error updating document status:', deleteError);
    }
    throw error;
  }
};

// プロフィール画像をアップロードし、そのURLを取得する関数
export const updateUserProfile = async (imageUrl: string) => {
  const userId = auth.currentUser?.uid;

  if (userId) {
    await setDoc(
      doc(db, "users", userId),
      { photoURL: imageUrl },
      { merge: true } // 既存のドキュメントにマージする場合
    );
  } else {
    console.error("ユーザーIDが取得できませんでした。");
  }
};

// ... (他の関数は変更なし)

export { app }
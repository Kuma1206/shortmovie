// lib/firebase.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/"; // 先ほど作成したfirebase.jsをインポート

// 画像をFirebase Storageにアップロードする関数
const uploadProfileImage = async (file) => {
  const storageRef = ref(storage, `profile_images/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url; // 画像のURLを返す
  } catch (error) {
    console.error("画像のアップロードに失敗しました:", error);
    throw error; // エラーをスロー
  }
};

export { uploadProfileImage }; // 他のファイルで使用できるようにエクスポート

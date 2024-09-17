// /**
//  * Import function triggers from their respective submodules:
//  *
//  * import {onCall} from "firebase-functions/v2/https";
//  * import {onDocumentWritten} from "firebase-functions/v2/firestore";
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// // import {onRequest} from "firebase-functions/v2/https";
// // import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// // export const helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// admin.initializeApp();

// exports.saveAudioUrlToFirestore = functions.storage.object().onFinalize(async (object: functions.storage.ObjectMetadata) => {
//   const filePath = object.name; // ファイルのパス
//   const fileBucket = object.bucket; // バケット名
//   const contentType = object.contentType; // コンテンツタイプ

//   // filePath と contentType が undefined でないことを確認
//   if (!filePath) {
//     console.log('ファイルパスが見つかりません:', filePath);
//     return null;
//   }

//   if (!contentType || !contentType.startsWith('audio/')) {
//     console.log('アップロードされたファイルは音声ファイルではありません:', filePath);
//     return null;
//   }

//   const fileNameParts = filePath.split('/');
// //   const userId = fileNameParts[1]; // フォルダ名がユーザーIDの場合
//   const videoId = fileNameParts[2].split('_')[0]; // ファイル名の最初の部分がvideoIdの場合

//   const bucket = admin.storage().bucket(fileBucket);
//   const file = bucket.file(filePath);
//   const [url] = await file.getSignedUrl({
//     action: 'read',
//     expires: '03-01-2500', // 期限の長いURLを生成
//   });

//   console.log('生成されたURL:', url);

//   // Firestore に URL を保存
//   const videoDocRef = admin.firestore().collection('videos').doc(videoId);
//   await videoDocRef.update({
//     audioUrl: url,
//   });

//   console.log('Firestore に音声URLを保存しました:', url);

//   return null;
// });
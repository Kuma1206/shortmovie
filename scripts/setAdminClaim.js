const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

// Firebase Admin SDK の初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<osmproject-34e1b>.firebaseio.com",
});

// 特定のユーザーに管理者権限を付与
admin
  .auth()
  .setCustomUserClaims("0BM8bHte2FXHXiCiOr1RlztAJgu1", { isAdmin: true })
  .then(() => {
    console.log("管理者権限が付与されました");
  })
  .catch((error) => {
    console.error("管理者権限の付与に失敗しました:", error);
  });

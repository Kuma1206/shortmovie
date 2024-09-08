// pages/login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/client";
import { useRouter } from "next/router";
import styles from "./style.module.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのリロードを防ぐ
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/kanrigamen_pgae"); // ログイン成功後に管理画面へ遷移
    } catch (err) {
      setError("ログインに失敗しました。");
    }
  };

  return (
    <>
      <div className={styles.mainbox}>
        <h2>管理画面ログイン</h2>
        <form onSubmit={handleLogin} className={styles.formbox}>
          <div className={styles.mailbox}>
            <label className={styles.label1}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputbox}
            />
          </div>
          <div className={styles.pwbox}>
            <label className={styles.label1}>パスワード</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputbox}
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <button type="submit" className={styles.loginbutton}>
            ログイン
          </button>
        </form>
      </div>
      <div className={styles.errorbox}>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
};

export default Login;

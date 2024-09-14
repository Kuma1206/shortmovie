import React from "react";
import styles from "./style.module.scss";
import K_HamburgerMenu from "@/components/K_burger_menu";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { login } from "../../lib/auth";
import Link from "next/link";
import UserMenu_kanri from "../UserMenu_kanri/index";
import SideBar from "../../components/SideBar";
import Kichiran from "../../components/K_ichiran";

import "react-tabs/style/react-tabs.css";

const Kheader = () => {
  const user = useAuth(); // ユーザー情報を取得
  const [waiting, setWaiting] = useState<boolean>(false);

  const signIn = () => {
    setWaiting(true);

    login()
      .catch((error) => {
        console.error(error?.code);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  return (
    <>
      <ul className={styles.menubox}>
        <li>
          <K_HamburgerMenu />
        </li>
        <div className={styles.headerInfo}>
          <h1>管理画面</h1>
          {user && <p>ようこそ、{user.email} さん</p>}
        </div>
        <div className={styles.login}>
          {user === null && !waiting && <p onClick={signIn}>ログイン</p>}
        </div>
        <div className={styles.icon}>{user && <UserMenu_kanri />} </div>
      </ul>


      <div className={styles.home}>
        <div>
          <SideBar />
        </div>
        <div className={styles.contents}>
          <Kichiran />
          {/* <CalendarItem /> */}
        </div>
      </div>
    </>
  );
};

export default Kheader;

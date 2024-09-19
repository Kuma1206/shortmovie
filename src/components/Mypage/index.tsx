import React from "react";
import styles from "./style.module.scss";
import Mypage_profile from "@/components/Mypage_profile";
import Movie_view from "@/components/Movie_view";
import Mheader from "@/components/M_header";

const Mypage = () => {
  return (
    <>
      <Mheader />
      <header className={styles.headerbox}>
        <Mypage_profile />
      </header>
      <main className={styles.mainbox}>
        <Movie_view />
      </main>
    </>
  );
};

export default Mypage;

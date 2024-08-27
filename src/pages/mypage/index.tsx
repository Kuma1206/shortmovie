import React from "react";
import styles from "./style.module.scss";
import Mypage_profile from "@/components/Mypage_profile";
import C_footer from "@/components/C_Footer";
import Slider_rireki from "@/components/Slider_rireki";
import Header from "@/components/Header";

const Mypage = () => {
  return (
    <>
      <Header />
      <header className={styles.headerbox}>
        <Mypage_profile />
      </header>
      <main>
        <Slider_rireki />
      </main>
      <C_footer />
    </>
  );
};

export default Mypage;

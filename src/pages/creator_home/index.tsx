import React from "react";
import styles from "./style.module.scss";
import C_header from "@/components/C_header";
import IntroductionMovie from "@/components/IntroductionMovie";
import IntroductionEpisode_cr from "@/components/IntroductionEpisode_cr";

const CreatorHome = () => {
  return (
    <>
      <header className={styles.hbox}>
        <C_header />
      </header>
      <main className={styles.episodebox}>
        <IntroductionEpisode_cr />
      </main>
    </>
  );
};

export default CreatorHome;

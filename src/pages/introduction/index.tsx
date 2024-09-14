import React from "react";
import styles from "./style.module.scss";
import IntroductionMovie from "@/components/IntroductionMovie";
import IntroductionEpisode from "@/components/IntroductionEpisode";

const Introduction = () => {
  return (
    <>
      <header className={styles.headerbox}>
        <IntroductionMovie />
      </header>
      <main className={styles.episodebox}>
        <IntroductionEpisode />
      </main>
    </>
  );
};

export default Introduction;

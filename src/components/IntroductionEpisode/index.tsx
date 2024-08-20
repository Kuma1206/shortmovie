import React from "react";
import styles from "./style.module.scss";
import Link from "next/link";

const IntroductionEpisode = () => {
  return (
    <>
      <main className={styles.mainbox1}>
        <div className={styles.shokaiarea}>
          <p>title</p>
          <div className={styles.episodearea1}>
            <div className={styles.area1}>
              <div className={styles.moviebox}>movie</div>
              <p className={styles.episodename}>Episonde1</p>
            </div>
            <div className={styles.syokai1}>
              紹介文ああああああああああああああああああああああああああああああああああああああああああああああああああ
            </div>
          </div>

          <div className={styles.episodearea1}>
            <div className={styles.area1}>
              <div className={styles.moviebox}>movie</div>
              <p className={styles.episodename}>Episonde1</p>
            </div>
            <div className={styles.syokai1}>
              紹介文ああああああああああああああああああああああああああああああああああああああああああああああああああ
            </div>
          </div>

          <div className={styles.episodearea1}>
            <div className={styles.area1}>
              <div className={styles.moviebox}>movie</div>
              <p className={styles.episodename}>Episonde1</p>
            </div>
            <div className={styles.syokai1}>
              紹介文ああああああああああああああああああああああああああああああああああああああああああああああああああ
            </div>
          </div>

          <div className={styles.episodearea1}>
            <div className={styles.area1}>
              <div className={styles.moviebox}>movie</div>
              <p className={styles.episodename}>Episonde1</p>
            </div>
            <div className={styles.syokai1}>
              紹介文ああああああああああああああああああああああああああああああああああああああああああああああああああ
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default IntroductionEpisode;

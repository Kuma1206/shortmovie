import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Carousel用のスタイルをインポート
import styles from "./style.module.scss";
import Link from "next/link";

const Slider_rireki = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };

  return (
    <div className={styles.menubox}>
      <p className={styles.title1}>視聴履歴</p>
      <Carousel responsive={responsive}>
        <div className={styles.itembox}>
          <Link href={"/introduction"}>
            <div className={styles.item}>アイテム1</div>
          </Link>
        </div>
        <div className={styles.itembox}>
          <div className={styles.item}>アイテム2</div>
        </div>
        <div className={styles.itembox}>
          <div className={styles.item}>アイテム3</div>
        </div>
        <div className={styles.itembox}>
          <div className={styles.item}>アイテム4</div>
        </div>
        <div className={styles.itembox}>
          <div className={styles.item}>アイテム5</div>
        </div>
      </Carousel>
    </div>
  );
};

export default Slider_rireki;

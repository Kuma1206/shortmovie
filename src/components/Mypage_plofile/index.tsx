import React from "react";
import styles from "./style.module.scss";
import IcBaselineAccountBox from "@/components/Profileimage";
import Link from "next/link";

const Mypage_profile = () => {
  return (
    <>
      <main className={styles.mainbox1}>
        <div className={styles.pbox}>
          <p className={styles.pimage}>
            <Link href={"/"}>
              <IcBaselineAccountBox className={styles.pimagebox } />
            </Link>
          </p>
          <div className={styles.psheet}>
            <p className={styles.ptext}>name：</p>
            <p className={styles.ptext}>自己紹介：</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Mypage_profile;

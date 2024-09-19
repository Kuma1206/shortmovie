import React from "react";
import Tab3 from "@/components/Tab3";
import styles from "./style.module.scss";
import Cheader from "@/components/C_header";

const Seisaku_page2 = () => {
  return (
    <>
      <header>
        <Cheader />
      </header>

      <main className={styles.mainbox}>
        <div>
          <Tab3 />
        </div>
      </main>
    </>
  );
};

export default Seisaku_page2;

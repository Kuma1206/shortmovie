import React from "react";
import styles from "./style.module.scss";
import C_header from "@/components/C_header";
import C_footer from "@/components/C_Footer";
import Tab3 from "@/components/Tab3";

const Seisaku_page = () => {
  return (
    <>
      <header>
        <C_header />
      </header>
      <main className={styles.mainbox}>
        <Tab3 />
      </main>
      <C_footer />
    </>
  );
};

export default Seisaku_page;

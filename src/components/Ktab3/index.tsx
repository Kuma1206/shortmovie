import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import styles from "./style.module.scss";
import "react-tabs/style/react-tabs.css";
import Shinki from "@/components/Shinki";
import K_dougaichiran from "@/components/K_dougaichiran";
import Ichijihozon from "@/components/Ichijihozon";

const Ktab3 = () => {
  return (
    <div className={styles.tabmenu}>
      <Tabs>
        <TabList className={styles.tabbox}>
          <Tab className={styles.menubox}>Myコンテンツ</Tab>
          <Tab className={styles.menubox}></Tab>
          <Tab className={styles.menubox}></Tab>
        </TabList>

        <TabPanel>
          <div>
            <K_dougaichiran />
          </div>{" "}
        </TabPanel>
        {/* <TabPanel>
          <div>
            <Shinki />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <Ichijihozon />
          </div>{" "}
        </TabPanel> */}
      </Tabs>
    </div>
  );
};

export default Ktab3;

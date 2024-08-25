import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import styles from "./style.module.scss";
import "react-tabs/style/react-tabs.css";
import Shinki from "@/components/Shinki";
import Dougaichiran from "@/components/Dougaichiran";
import Ichijihozon from "@/components/Ichijihozon";

const Tab3 = () => {
  return (
    <div className={styles.tabmenu}>
      <Tabs>
        <TabList className={styles.tabbox}>
          <Tab className={styles.menubox}>動画一覧</Tab>
          <Tab className={styles.menubox}>新規作成</Tab>
          <Tab className={styles.menubox}>一時保存</Tab>
        </TabList>

        <TabPanel>
          <div>
            <Dougaichiran />
          </div>{" "}
        </TabPanel>
        <TabPanel>
          <div>
            <Shinki />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <Ichijihozon />
          </div>{" "}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Tab3;

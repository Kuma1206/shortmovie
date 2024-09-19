import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import Cheader from "@/components/C_header";
import Tab3 from "@/components/Tab3";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { HomeIcon, PlusIcon, UserIcon } from "@heroicons/react/outline";
import Mypage from "@/components/Mypage";

const Seisaku_page2 = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(2); // タブの状態管理、初期値を1に設定
  const router = useRouter();

  // タブのクリックイベント
  const handleIconClick = (index: number) => {
    setActiveTabIndex(index);
  };

  // HomeIconクリック時にindexページにリダイレクト
  const handleHomeClick = () => {
    router.push("/"); // ホームページ (index.js) にリダイレクト
  };

  return (
    <>
      <header>
        <Cheader />
      </header>
      <main className={styles.mainbox}>
        <Tabs
          selectedIndex={activeTabIndex}
          onSelect={(index) => setActiveTabIndex(index)}
        >
          <TabPanel>
            <div className={styles.textbox}>
              {/* 動画一覧のコンテンツ */}
              動画一覧へ
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <Tab3 />
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <Mypage />
            </div>
          </TabPanel>
        </Tabs>
      </main>
      <div className={styles.tabmenu}>
        <TabList className={styles.tabbox}>
          <Tab className={styles.menubox}>
            <div onClick={handleHomeClick}>
              <HomeIcon className={styles.icon} />
            </div>
          </Tab>
          <Tab className={styles.menubox}>
            <div onClick={() => handleIconClick(1)}>
              <PlusIcon
                className={
                  activeTabIndex === 1 ? styles.iconClicked2 : styles.icon2
                }
              />
            </div>
          </Tab>
          <Tab className={styles.menubox}>
            <div onClick={() => handleIconClick(2)}>
              <UserIcon
                className={
                  activeTabIndex === 2 ? styles.iconClicked : styles.icon
                }
              />
            </div>
          </Tab>
        </TabList>
      </div>
    </>
  );
};

export default Seisaku_page2;

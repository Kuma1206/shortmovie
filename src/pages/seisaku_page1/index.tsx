import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import Cheader from "@/components/C_header";
import Tab3 from "@/components/Tab3";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { HomeIcon, PlusIcon, UserIcon } from "@heroicons/react/outline";
import Mypage from "@/components/Mypage";
import Home from "@/pages/home";

const Seisaku_page1 = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(2); // タブの状態管理、初期値を2に設定
  const router = useRouter();

  // タブのクリックイベント
  const handleIconClick = (index: number, route?: string) => {
    setActiveTabIndex(index);
    if (route) {
      router.push(route); // ページ遷移が指定されている場合はリダイレクト
    }
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
            <div>
              <Home />
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
          <Tab
            className={styles.menubox}
            onClick={() => handleIconClick(0, "/home")} // ホーム画面（"/"）へリダイレクト
          >
            <HomeIcon
              className={
                activeTabIndex === 0 ? styles.iconClicked : styles.icon
              }
            />
          </Tab>

          <Tab
            className={styles.menubox}
            onClick={() => handleIconClick(1, "/seisaku_page2")} // /seisaku_page2 にリダイレクト
          >
            <PlusIcon
              className={
                activeTabIndex === 1 ? styles.iconClicked2 : styles.icon2
              }
            />
          </Tab>

          <Tab
            className={styles.menubox}
            onClick={() => handleIconClick(2)} // タブの状態だけ更新
          >
            <UserIcon
              className={
                activeTabIndex === 2 ? styles.iconClicked : styles.icon
              }
            />
          </Tab>
        </TabList>
      </div>
    </>
  );
};

export default Seisaku_page1;

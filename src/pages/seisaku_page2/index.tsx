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
  const [activeTabIndex, setActiveTabIndex] = useState(1); // タブの状態管理、初期値を1に設定
  const router = useRouter();

  // タブのクリックイベントとページ遷移の処理を一つにまとめる
  const handleIconClick = (index: number, route?: string) => {
    setActiveTabIndex(index);
    if (route) {
      router.push(route); // ページ遷移が指定されている場合にリダイレクト
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
          {/* TabPanel の数を Tab と一致させる */}
          <TabPanel>
            <div className={styles.textbox}>動画一覧へ</div>
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
            onClick={() => handleIconClick(0, "/")} // ホーム画面（"/"）へリダイレクト
          >
            <HomeIcon className={styles.icon} />
          </Tab>
          <Tab
            className={styles.menubox}
            onClick={() => handleIconClick(1)} // タブ切り替えだけ行う
          >
            <PlusIcon
              className={
                activeTabIndex === 1 ? styles.iconClicked2 : styles.icon2
              }
            />
          </Tab>
          <Tab
            className={styles.menubox}
            onClick={() => handleIconClick(2)} // タブ切り替えだけ行う
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

export default Seisaku_page2;

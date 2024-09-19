import React, { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { Tabs, TabList, Tab } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { HomeIcon, PlusIcon, UserIcon } from "@heroicons/react/outline";
import styles from "./style.module.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(2); // タブの状態管理
  const router = useRouter();

  // URLに基づいてタブのインデックスを設定
  useEffect(() => {
    switch (router.pathname) {
      case "/home":
        setActiveTabIndex(0);
        break;
      case "/seisaku_page2":
        setActiveTabIndex(1);
        break;
      case "/seisaku_page1":
        setActiveTabIndex(2);
        break;
      default:
        setActiveTabIndex(2);
        break;
    }
  }, [router.pathname]);

  // タブのクリックイベント
  const handleIconClick = (index: number, route?: string) => {
    if (route) {
      router.push(route); // ページ遷移が指定されている場合はリダイレクト
    }
  };

  return (
    <>
      <header>{/* ここにヘッダーコンポーネントが入る */}</header>
      <main className={styles.mainbox}>
        <Tabs
          selectedIndex={activeTabIndex}
          onSelect={(index) => setActiveTabIndex(index)}
        >
          <div className={styles.tabmenu}>
            <TabList className={styles.tabbox}>
              <Tab
                className={styles.menubox}
                onClick={() => handleIconClick(0, "/home")}
              >
                <HomeIcon
                  className={
                    activeTabIndex === 0 ? styles.iconClicked : styles.icon
                  }
                />
              </Tab>

              <Tab
                className={styles.menubox}
                onClick={() => handleIconClick(1, "/seisaku_page2")}
              >
                <PlusIcon
                  className={
                    activeTabIndex === 1 ? styles.iconClicked2 : styles.icon2
                  }
                />
              </Tab>

              <Tab
                className={styles.menubox}
                onClick={() => handleIconClick(2, "/seisaku_page1")}
              >
                <UserIcon
                  className={
                    activeTabIndex === 2 ? styles.iconClicked : styles.icon
                  }
                />
              </Tab>
            </TabList>
          </div>
        </Tabs>
        {/* 子要素（動的なページコンテンツ）を表示 */}
        <div>{children}</div>
      </main>
    </>
  );
};

export default Layout;

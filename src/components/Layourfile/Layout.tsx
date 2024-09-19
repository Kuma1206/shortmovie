import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import { Tabs, TabList, Tab } from "react-tabs";
import { HomeIcon, PlusIcon, UserIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import styles from "./style.module.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isHomePage = router.pathname === "/" || router.pathname === "/home";
  const isSeisakuPage =
    router.pathname === "/seisaku_page2";
  const isMyPage =
    router.pathname === "/seisaku_page1";

  return (
    <>
      <header>{/* 共通ヘッダー */}</header>
      <main
        className={styles.mainbox} // ホームページかどうかでスタイルを変更
      >
        <Tabs>
          <div className={styles.tabmenu}>
            <TabList className={styles.tabbox}>
              <Tab
                className={isHomePage ? styles.homeMain : styles.menubox}
                onClick={() => router.push("/home")}
              >
                <HomeIcon
                  className={classNames(styles.icon, {
                    [styles.iconClicked]: isHomePage,
                    [styles.homeicon]: isHomePage,
                  })}
                />
              </Tab>
              <Tab
                className={isSeisakuPage ? styles.homeMain : styles.menubox}
                onClick={() => router.push("/seisaku_page2")}
              >
                <PlusIcon
                  className={classNames(styles.icon, {
                    [styles.iconClicked]: isSeisakuPage,
                    [styles.homeicon]: isSeisakuPage,
                  })}
                />
              </Tab>
              <Tab
                className={isMyPage ? styles.homeMain : styles.menubox}
                onClick={() => router.push("/seisaku_page1")}
              >
                <UserIcon
                  className={classNames(styles.icon, {
                    [styles.iconClicked]: isMyPage,
                    [styles.homeicon]: isMyPage,
                  })}
                />
              </Tab>
            </TabList>
          </div>
        </Tabs>
        <div>{children}</div>
      </main>
    </>
  );
};

export default Layout;

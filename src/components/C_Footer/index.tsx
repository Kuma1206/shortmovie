import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import Link from "next/link";
import { HomeIcon, UserIcon, PlusIcon } from "@heroicons/react/solid";

const C_footer = () => {
  const router = useRouter();
  const [clickedIcon, setClickedIcon] = useState<string | null>(null);

  useEffect(() => {
    switch (router.pathname) {
      case "/":
        setClickedIcon("home");
        break;
      case "/seisaku_page":
        setClickedIcon("plus");
        break;
      case "/mypage":
        setClickedIcon("user");
        break;
      default:
        setClickedIcon(null);
    }
  }, [router.pathname]);

  const handleIconClick = (icon: string) => {
    setClickedIcon(icon);
  };

  return (
    <ul className={styles.menubox}>
      <Link href={"/"}>
        <li>
          <HomeIcon
            className={
              router.pathname === "/" || clickedIcon === "home"
                ? styles.iconClicked
                : styles.icon
            }
            onClick={() => handleIconClick("home")}
          />
        </li>
      </Link>
      <li>
        <Link href={"/seisaku_page"} legacyBehavior>
          <a onClick={() => handleIconClick("plus")}>
            <PlusIcon
              className={
                clickedIcon === "plus" ? styles.iconClicked2 : styles.icon2
              }
            />
          </a>
        </Link>
      </li>
      <li>
        <Link href={"/mypage"} legacyBehavior>
          <a onClick={() => handleIconClick("user")}>
            <UserIcon
              className={
                clickedIcon === "user" ? styles.iconClicked : styles.icon
              }
            />
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default C_footer;

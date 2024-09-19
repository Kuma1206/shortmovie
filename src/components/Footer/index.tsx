import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import Link from "next/link";
import { HomeIcon, HeartIcon, UserIcon } from "@heroicons/react/outline";


const Footer = () => {
  const router = useRouter();
  const [clickedIcon, setClickedIcon] = useState<string | null>(null);

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
                ? styles.iconClicked2
                : styles.icon
            }
            onClick={() => handleIconClick("home")}
          />
        </li>
      </Link>
      <li>
        <HeartIcon
          className={clickedIcon === "heart" ? styles.iconClicked : styles.icon}
          onClick={() => handleIconClick("heart")}
        />
      </li>
      <li>
        <Link href={"/seisaku_page2"}>
          <UserIcon
            className={
              clickedIcon === "user" ? styles.iconClicked : styles.icon
            }
            onClick={() => handleIconClick("user")}
          />
        </Link>
      </li>
    </ul>
  );
};

export default Footer;

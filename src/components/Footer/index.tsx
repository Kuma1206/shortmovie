import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import Link from "next/link";
import { HomeIcon, PlusIcon, UserIcon } from "@heroicons/react/outline";


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
        <Link href={"/seisaku_page2"}>
          <PlusIcon
            className={
              clickedIcon === "olus" ? styles.iconClicked : styles.icon
            }
            onClick={() => handleIconClick("plus")}
          />
        </Link>
      </li>
      <li>
        <Link href={"/seisaku_page1"}>
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

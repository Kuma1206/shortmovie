import React from "react";
import styles from "./style.module.scss";
import HamburgerMenu from "@/components/Burger_menu";


const Header = () => {
  return (
    <ul className={styles.menubox}>
      <li>
        <HamburgerMenu />
      </li>
    </ul>
  );
};

export default Header;

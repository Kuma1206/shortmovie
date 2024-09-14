import React, { useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.menuContainer}>
      <button className={styles.hamburger} onClick={toggleMenu}>
        <span
          className={`${styles.line} ${isOpen ? styles.lineOpen : ""} ${
            isOpen ? styles.lineClose : ""
          }`}
        ></span>
        <span
          className={`${styles.line} ${isOpen ? styles.lineOpen : ""} ${
            isOpen ? styles.lineClose : ""
          }`}
        ></span>
        <span
          className={`${styles.line} ${isOpen ? styles.lineOpen : ""} ${
            isOpen ? styles.lineClose : ""
          }`}
        ></span>
      </button>
      {isOpen && (
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="/">📁Movie</Link>
            </li>
            <li>
              <Link href="/about">📁Voice</Link>
            </li>
            <li>
              <Link href="/services">📁Photo</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default HamburgerMenu;

import React, { useState } from "react";
import styles from "./style.module.scss";

const K_HamburgerMenu = () => {
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
              <a href="/">📁Movie</a>
            </li>
            <li>
              <a href="/about">📁Voive</a>
            </li>
            <li>
              <a href="/services">📁Fhoto</a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default K_HamburgerMenu;

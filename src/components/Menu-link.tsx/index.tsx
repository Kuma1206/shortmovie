// MenuLink.tsx
import Link from "next/link";
import { ReactNode } from "react";
import styles from "./style.module.scss";

const MenuLink = ({
  href,
  children,
  ...rest
}: {
  href: string;
  children: ReactNode;
}) => {
  return (
    <Link href={href} {...rest}>
      <span className={styles.link}>
        {" "}
        {/* <a> タグを <span> に変更 */}
        {children}
      </span>
    </Link>
  );
};

export default MenuLink;

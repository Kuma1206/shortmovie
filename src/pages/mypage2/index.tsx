import React from "react";
import styles from "./style.module.scss";
import Mypage_profile from "@/components/Mypage_profile";
import C_footer from "@/components/C_Footer";
import Slider_rireki from "@/components/Slider_rireki";
import Header from "@/components/Header";
import UserGuard from "../../components/Guards";
import UserCard from "../../components/UserCard";
import { useAuth } from "../../context/auth";
import { ShareIcon, PencilIcon } from "@heroicons/react/outline";
import Link from "next/link";

const Mypage = () => {
  const user = useAuth();

  return (
    <>
      <UserGuard>
        {(user) => {
          const actions = [
            {
              icon: <ShareIcon />,
              label: "シェア",
              link: `/${user.id}`, // userが定義された後に参照
            },
            {
              icon: <PencilIcon />,
              label: "編集",
              link: "/mypage/edit",
            },
          ];

          return (
            <div className={styles.backgroundcontainer}>
              <div className={styles.container}>
                <div className={styles.actionlink}>
                  {actions.map((action) => (
                    <Link
                      href={action.link}
                      key={action.label}
                      className={styles.actionlink}
                    >
                      <span className={styles.icon}>{action.icon}</span>
                      <span>{action.label}</span>
                    </Link>
                  ))}
                </div>
                <UserCard user={user} />
              </div>
            </div>
          );
        }}
      </UserGuard>
    </>
  );
};

export default Mypage;

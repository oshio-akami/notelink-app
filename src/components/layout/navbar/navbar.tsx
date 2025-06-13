"use client";

import styles from "./navbar.module.scss";
import {
  IconDashboard,
  IconUsersGroup,
  IconClipboardText,
} from "@tabler/icons-react";
import HomeMenu from "@/components/navbar/homeMenu/homeMenu";
import GroupMenu from "@/components/navbar/groupMenu/groupMenu";
import { useGroup } from "@/libs/context/groupContext/groupContext";
import useSWR from "swr";
import client from "@/libs/honoClient";

const iconSize = 24;

const homeMenuData = [
  {
    label: "ホーム",
    link: "/home",
    icon: <IconDashboard size={iconSize} stroke={1.5} />,
  },
  {
    label: "投稿",
    link: "/post",
    icon: <IconClipboardText size={iconSize} stroke={1.5} />,
  },
  {
    label: "メンバー",
    link: "/member",
    icon: <IconUsersGroup size={iconSize} stroke={1.5} />,
  },
];

/**ナビゲーションバーコンポーネント */
export function NavBar() {
  const { groupId } = useGroup();
  const { data: groups, isLoading } = useSWR("/groups", async () => {
    const res = await client.api.user.groups.$get();
    const body = await res.json();
    return body.groups;
  });

  return (
    <>
      <nav className={styles.navbar}>
        <HomeMenu menus={homeMenuData} groupId={groupId} />
        {!isLoading && groups && <GroupMenu groups={groups} />}
      </nav>
    </>
  );
}

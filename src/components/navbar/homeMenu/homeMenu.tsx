"use client";

import { IconProps } from "@tabler/icons-react";
import React from "react";
import { NavLink, Text } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import styles from "./homeMenu.module.scss";

type Props = {
  menus: {
    label: string;
    link: string;
    icon: React.ReactElement<IconProps>;
  }[];
  groupId: string;
};

/**指定されたグループIDとリンクから完全なリンクを生成する関数 */
const createLink = (id: string, link: string) => {
  return `/group/${id}${link}`;
};

/**
 *HomeMenu コンポーネント
 *与えられたメニュー項目を元にホームメニュー生成します。
 *@example
 *const menus = [
 *  { label: "ホーム", link: "/home", icon: <IconHome size={16} stroke={1.5} /> },
 *  { label: "設定", link: "/settings", icon: <IconSettings size={16} stroke={1.5} /> },
 *  ];
 * return <HomeMenu menus={menus} groupId={id} />;
 */
export default function HomeMenu({ menus, groupId }: Props) {
  const router = useRouter();
  const path = usePathname();
  const links = menus.map((target) => (
    <NavLink
      className={styles.menu}
      key={target.link}
      onClick={() => router.push(createLink(groupId, target.link))}
      label={target.label}
      leftSection={target.icon}
      active={path.indexOf(createLink(groupId, target.link)) !== -1}
      color="#f0f0f0"
      variant="filled"
      autoContrast
    />
  ));
  return (
    <div className={styles.menu}>
      <Text className={styles.label}>ホームメニュー</Text>
      {links}
    </div>
  );
}

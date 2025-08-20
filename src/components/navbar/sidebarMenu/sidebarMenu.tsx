"use client";

import { IconProps } from "@tabler/icons-react";
import React from "react";
import { NavLink, Text } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import styles from "./sidebarMenu.module.scss";

type Props = {
  title: string;
  menus: {
    label: string;
    link: string;
    icon: React.ReactElement<IconProps>;
  }[];
};

/**サイドバーのメニューコンポーネント*/
export default function SidebarMenu({ title, menus }: Props) {
  const router = useRouter();
  const path = usePathname();
  const links = menus.map((target) => (
    <NavLink
      className={styles.menu}
      key={target.link}
      onClick={() => router.push(target.link)}
      label={target.label}
      leftSection={target.icon}
      active={path.indexOf(target.link) !== -1}
      color="#f0f0f0"
      variant="filled"
      autoContrast
    />
  ));
  return (
    <div className={styles.menu}>
      <Text className={styles.label}>{title}</Text>
      {links}
    </div>
  );
}

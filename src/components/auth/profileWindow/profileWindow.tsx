"use client";

import styles from "./profileWindow.module.scss";
import { Popover, List, Avatar, Text } from "@mantine/core";
import { ReactNode } from "react";
import { signIn } from "next-auth/react";
import signOut from "@/actions/user/signOut";
import { IconLogout, IconUserPlus } from "@tabler/icons-react";

type Props = {
  name: string;
  icon: string;
  children: ReactNode;
};

export function ProfileWindow({ name, icon, children }: Props) {
  return (
    <>
      <Popover width={320} trapFocus offset={{ mainAxis: 10, crossAxis: 40 }}>
        <Popover.Target>{children}</Popover.Target>
        <Popover.Dropdown className={styles.window}>
          <div className={styles.profile}>
            <Avatar size="2rem" alt="avatar" src={icon} />
            <Text>{name}</Text>
          </div>
          <div className={styles.setting}>
            <List>
              <List.Item
                icon={<IconUserPlus />}
                onClick={() => signIn("google")}
              >
                別のアカウントでログイン
              </List.Item>
              <List.Item icon={<IconLogout />} onClick={() => signOut()}>
                ログアウト
              </List.Item>
            </List>
          </div>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}

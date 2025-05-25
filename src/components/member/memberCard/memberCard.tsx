"use client";

import { Text, Avatar } from "@mantine/core";
import styles from "./memberCard.module.scss";
import { IconDotsVertical } from "@tabler/icons-react";

type Props = {
  userProfile: {
    userId: string | null;
    displayName: string | null;
    image: string | null;
    role: string | null;
  };
  viewerIsAdmin: boolean;
};

export default function MemberCard({ userProfile, viewerIsAdmin }: Props) {
  if (!userProfile) {
    return <></>;
  }
  return (
    <div className={styles.card}>
      <div className={styles.leftSection}>
        <Avatar src={userProfile.image} alt="user Profile" />
        <div>
          <Text>{userProfile.displayName}</Text>
          <Text c="gray">{userProfile.role}</Text>
        </div>
      </div>
      {viewerIsAdmin && <IconDotsVertical />}
    </div>
  );
}

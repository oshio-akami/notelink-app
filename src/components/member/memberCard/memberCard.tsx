"use client";

import { Text, Avatar } from "@mantine/core";
import styles from "./memberCard.module.scss";
import { IconDotsVertical } from "@tabler/icons-react";
import MemberPopup from "../memberPopup/memberPopup";
import { useSession } from "next-auth/react";

type Props = {
  userProfile: {
    userId: string | null;
    displayName: string | null;
    image: string | null;
    role: string | null;
  };
  viewerIsAdmin: boolean;
  groupId: string;
};

export default function MemberCard({
  userProfile,
  viewerIsAdmin,
  groupId,
}: Props) {
  const session = useSession();
  if (!userProfile && !session.data?.user?.id) {
    return <></>;
  }
  const isOwnProfile = () => {
    return session?.data?.user?.id === userProfile.userId;
  };
  return (
    <div className={styles.card}>
      <div className={styles.leftSection}>
        <Avatar src={userProfile.image} alt="user Profile" />
        <div>
          <Text>{userProfile.displayName}</Text>
          <Text c="gray">{userProfile.role}</Text>
        </div>
      </div>
      {(viewerIsAdmin || isOwnProfile()) && (
        <MemberPopup
          viewerIsAdmin={viewerIsAdmin}
          isOwnProfile={isOwnProfile()}
          groupId={groupId}
          userProfile={userProfile!}
        >
          <IconDotsVertical />
        </MemberPopup>
      )}
    </div>
  );
}

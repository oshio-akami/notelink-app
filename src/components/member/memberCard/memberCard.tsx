"use client";

import { Text, Avatar } from "@mantine/core";
import styles from "./memberCard.module.scss";
import { IconDotsVertical } from "@tabler/icons-react";
import MemberPopup from "../memberPopup/memberPopup";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/utils/types/profileType";

type Props = {
  userProfile: UserProfile;
  viewerIsAdmin: boolean;
};

export default function MemberCard({ userProfile, viewerIsAdmin }: Props) {
  const session = useSession();
  if (!session.data?.user?.id) {
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
          userProfile={userProfile}
        >
          <IconDotsVertical />
        </MemberPopup>
      )}
    </div>
  );
}

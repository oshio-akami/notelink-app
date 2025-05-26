"use client";

import { Flex, Text } from "@mantine/core";
import MemberCard from "../memberCard/memberCard";
import styles from "./memberList.module.scss";

type Props = {
  members: {
    userId: string | null;
    displayName: string | null;
    image: string | null;
    role: string | null;
  }[];
  groupId: string;
  viewerIsAdmin: boolean;
};
export default function MemberList({ members, groupId, viewerIsAdmin }: Props) {
  const memberCards = members?.map((member) => (
    <MemberCard
      key={member.userId}
      userProfile={member!}
      viewerIsAdmin={viewerIsAdmin}
      groupId={groupId}
    />
  ));
  return (
    <div className={styles.wrapper}>
      <Flex justify="space-between">
        <Text fw={700} size="xl">
          参加者一覧
        </Text>
        <Text c="gray">参加人数{members.length}人</Text>
      </Flex>
      {memberCards}
    </div>
  );
}

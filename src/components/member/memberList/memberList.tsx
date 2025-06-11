"use client";

import { Flex, Text } from "@mantine/core";
import MemberCard from "../memberCard/memberCard";
import styles from "./memberList.module.scss";
import { useMember } from "@/libs/hooks/member";
import { useGroup } from "@/libs/context/groupContext/groupContext";
import { useProfile } from "@/libs/hooks/user";
import { MemberActionsContext } from "@/libs/context/memberActionsContext/memberActionsContext";
import Loading from "@/components/shared/loading/loading";

export default function MemberList() {
  const { groupId } = useGroup();
  const { members, handleDeleteMember } = useMember(groupId);
  const { isRoleAdmin } = useProfile(groupId);
  const memberCards = members?.map((member) => (
    <MemberCard
      key={member.userId}
      userProfile={member}
      viewerIsAdmin={isRoleAdmin}
    />
  ));
  return (
    <MemberActionsContext.Provider value={{ handleDeleteMember }}>
      <div className={styles.wrapper}>
        <Flex justify="space-between">
          <Text fw={700} size="xl">
            参加者一覧
          </Text>
          <Text c="gray">参加人数{members ? members.length : 0}人</Text>
        </Flex>
        {members ? memberCards : <Loading text="読み込み中" />}
      </div>
    </MemberActionsContext.Provider>
  );
}

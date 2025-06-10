"use client";

import styles from "./inviteWindow.module.scss";
import JoinButton from "../JoinButton/joinButton";
import { UserProfile } from "@/utils/types/profileType";
import { IconUsersGroup } from "@tabler/icons-react";
import { Text, Avatar, Image } from "@mantine/core";

type Props = {
  groupName: string;
  inviteToken: string;
  members: UserProfile[];
};

const displayMemberLimit = 5;

export default function InviteWindow({
  groupName,
  inviteToken,
  members,
}: Props) {
  const limitedMembers = members.slice(0, displayMemberLimit);
  const memberElements = () => {
    return limitedMembers.map((member, index) => (
      <Avatar
        key={index}
        src={member.image}
        bg="white"
        /**一番上の要素を少し大きく(錯覚再作) */
        size={
          index === limitedMembers.length - 1 &&
          limitedMembers.length < displayMemberLimit
            ? 47
            : 45
        }
        style={{
          marginLeft: index === 0 ? 0 : -25,
          border: "1px solid lightgray",
          zIndex: index,
        }}
      />
    ));
  };
  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <Image
          mr="auto"
          w={120}
          src="https://pub-0e85cec67fe344ccb5094d3659571d7d.r2.dev/sample_logo.png"
          alt="logo"
        />
        <div className={styles.description}>
          <Text>グループに招待されています</Text>
          <Text fw={700} size="1.2rem">
            {groupName}
          </Text>
        </div>
        <div className={styles.membersList}>
          <IconUsersGroup className={styles.icon} />
          <div>
            <Text>参加者</Text>
            <Text>{members.length}人</Text>
          </div>
          <div className={styles.memberElements}>
            {memberElements()}
            {members.length > displayMemberLimit && (
              <Avatar
                bg="white"
                size={47}
                style={{
                  border: "1px solid lightgray",
                  marginLeft: -25,
                  zIndex: displayMemberLimit,
                }}
              >
                <Text>+{members.length - limitedMembers.length}</Text>
              </Avatar>
            )}
          </div>
        </div>
        <JoinButton inviteToken={inviteToken} />
      </div>
    </div>
  );
}

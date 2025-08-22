"use client";

import { Card, Group, Text } from "@mantine/core";
import styles from "./groupCard.module.scss";
import { redirect } from "next/navigation";
import { formatDate } from "@/libs/utils";
import { IconClock, IconMessageCircle, IconUsers } from "@tabler/icons-react";

type Props = {
  groupSummary: {
    groupId: string;
    groupName: string;
    postCount: number;
    lastPostAt: string | null;
    memberCount: number;
  };
};

export default function GroupCard({ groupSummary }: Props) {
  return (
    <Card
      onClick={() => {
        redirect(`/group/${groupSummary.groupId}/articles`);
      }}
      className={styles.card}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <section className={styles.main}>
        <Text fw={700} size="lg">
          {groupSummary.groupName}
        </Text>
        <Text size="md">description</Text>

        <Group gap={0}>
          <IconClock size="1rem" color="#555555" />
          <Text fw={500} c="#555555">
            最終更新:
          </Text>
          <Text fw={500} c="#555555">
            {groupSummary.lastPostAt
              ? formatDate(groupSummary.lastPostAt)
              : "投稿なし"}
          </Text>
        </Group>
      </section>
      <section className={styles.sub}>
        <Group gap={10}>
          <Group gap={3}>
            <IconMessageCircle size="1rem" color="#555555" />
            <Text fw={500} c="#555555">
              {groupSummary.postCount}
            </Text>
            <Text fw={500} size="sm" c="#555555">
              投稿
            </Text>
          </Group>
          <Group gap={3}>
            <IconUsers size="1rem" color="#555555" />
            <Text fw={500} c="#555555">
              {groupSummary.memberCount}
            </Text>
            <Text fw={500} size="sm" c="#555555">
              メンバー
            </Text>
          </Group>
        </Group>
      </section>
    </Card>
  );
}

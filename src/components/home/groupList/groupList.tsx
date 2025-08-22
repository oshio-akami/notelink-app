"use client";

import { Group, SegmentedControl, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import GroupCard from "../groupCard/groupCard";
import { IconSearch } from "@tabler/icons-react";
import styles from "./groupList.module.scss";

type Props = {
  groupSummaries: {
    groupId: string;
    groupName: string;
    postCount: number;
    lastPostAt: string | null;
    memberCount: number;
  }[];
};

export default function GroupsList({ groupSummaries }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState("name");
  const [ascending, setAscending] = useState("false");
  const [sortedGroups, setSortedGroups] = useState(groupSummaries.slice());
  const groupCards = sortedGroups
    .filter(
      (groupSummary) => groupSummary.groupName.indexOf(searchValue) !== -1
    )
    .map((groupSummary) => {
      return (
        <GroupCard groupSummary={groupSummary} key={groupSummary.groupId} />
      );
    });

  useEffect(() => {
    if (!groupSummaries) return;

    const sorted = [...groupSummaries];

    if (value === "new") {
      const withPosts = sorted.filter((g) => g.lastPostAt);
      const noPosts = sorted.filter((g) => !g.lastPostAt);

      const sortedWithPosts = withPosts.sort(
        (a, b) =>
          new Date(a.lastPostAt!).getTime() - new Date(b.lastPostAt!).getTime()
      );
      //投稿がないものはソート関係なく最後に
      setSortedGroups(
        ascending === "true"
          ? [...sortedWithPosts, ...noPosts]
          : [...sortedWithPosts.reverse(), ...noPosts]
      );
      return;
    } else if (value === "name") {
      sorted.sort((a, b) => a.groupName.localeCompare(b.groupName, "ja"));
    } else if (value === "member") {
      sorted.sort((a, b) => a.memberCount - b.memberCount);
    }
    setSortedGroups(ascending === "true" ? sorted : sorted.reverse());
  }, [value, ascending, groupSummaries]);

  return (
    <div className={styles.groupList}>
      <Text fw={700} size="xl" td="underline" mt={20} mb={10}>
        グループ一覧
      </Text>
      <Group>
        <Text>並び替え:</Text>
        <SegmentedControl
          value={value}
          onChange={(value) => {
            setAscending(value === "name" ? "true" : "false");
            setValue(value);
          }}
          data={[
            { label: "名前", value: "name" },
            { label: "新着", value: "new" },
            { label: "メンバー数", value: "member" },
          ]}
        />
        <SegmentedControl
          value={ascending}
          onChange={setAscending}
          data={[
            { label: "昇順", value: "true" },
            { label: "降順", value: "false" },
          ]}
        />
      </Group>
      <TextInput
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        label="グループを検索"
        leftSection={<IconSearch />}
        mb={10}
      />
      <div className={styles.list}>{groupCards}</div>
    </div>
  );
}

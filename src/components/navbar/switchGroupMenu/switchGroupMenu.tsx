"use client";

import { Accordion, NavLink, Text } from "@mantine/core";
import styles from "./switchGroupMenu.module.scss";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "@/components/shared/searchBar/SearchBar";
import { useState } from "react";
import useSWR from "swr";
import client from "@/libs/honoClient";

/**指定されたグループIDからホームへのリンクを生成する関数 */
const createLink = (id: string) => {
  return `/group/${id}/articles`;
};

/**検索バーを備えたグループ一覧のメニューを表示するコンポーネント*/
export default function SwitchGroupMenu() {
  const { data: groups, isLoading } = useSWR("/groups", async () => {
    const res = await client.api.user.groups.$get();
    const body = await res.json();
    return body.groups;
  });
  const router = useRouter();
  const path = usePathname();
  const [searchValue, setSearchValue] = useState("");
  const filterGroups =
    groups && !isLoading
      ? groups.filter(
          (group) =>
            searchValue === "" || group.groupName.indexOf(searchValue) !== -1
        )
      : [];
  const links = filterGroups.map((group) => (
    <NavLink
      className={styles.menu}
      key={group.groupId}
      onClick={() => router.push(createLink(group.groupId))}
      label={`#${group.groupName}`}
      active={path.indexOf(group.groupId) !== -1}
      color="#f0f0f0"
      variant="filled"
      autoContrast
    />
  ));
  return (
    <>
      <Text className={styles.label}>グループ一覧</Text>
      <SearchBar
        placeHolder="グループを検索"
        onChange={(value) => {
          setSearchValue(value);
        }}
      />
      <Accordion className={styles.accordion} defaultValue="item">
        <Accordion.Item value="item">
          <Accordion.Control>general</Accordion.Control>
          <Accordion.Panel>{links}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

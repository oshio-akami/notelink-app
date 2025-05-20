"use client";

import { NavLink, ScrollArea, Text } from "@mantine/core";
import styles from "./groupMenu.module.scss";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "@/components/shared/searchBar/SearchBar";
import { useState } from "react";

type Props = {
  groups: {
    groupId: string;
    groupName: string;
  }[];
};

/**指定されたグループIDからホームへのリンクを生成する関数 */
const createLink = (id: string) => {
  return `/group/${id}/home`;
};

/**検索バーを備えたグループ一覧のメニューを表示するコンポーネント*/
export default function GroupMenu({ groups }: Props) {
  const router = useRouter();
  const path = usePathname();
  const [searchValue, setSearchValue] = useState("");
  const filterGroups = groups.filter(
    (group) => searchValue === "" || group.groupName.indexOf(searchValue) !== -1
  );
  const links = filterGroups.map((group) => (
    <NavLink
      className={styles.menu}
      key={group.groupId}
      onClick={() => router.push(createLink(group.groupId))}
      label={group.groupName}
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
      <ScrollArea w="100%" type="always" mah={200} className={styles.border}>
        {links}
      </ScrollArea>
    </>
  );
}

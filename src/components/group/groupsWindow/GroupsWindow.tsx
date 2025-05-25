"use client";

import styles from "./groupWindow.module.scss";
import { Popover, ScrollArea, TextInput } from "@mantine/core";
import { ReactNode, useState } from "react";
import { Grid, GridCol, Text } from "@mantine/core";
import GroupCard from "@/components/group/groupCard/groupCard";
import { IconSearch } from "@tabler/icons-react";

type Props = {
  groups: {
    groupId: string;
    groupName: string;
  }[];
  children: ReactNode;
};

export default function GroupsWindow({ groups, children }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const groupCards = groups
    .filter((group) => group.groupName.indexOf(searchValue) !== -1)
    .map((group) => {
      return (
        <GridCol key={group.groupId} span={{ base: 12, md: 4 }}>
          <GroupCard groupName={group.groupName} groupId={group.groupId} />
        </GridCol>
      );
    });
  return (
    <>
      <Popover width="60%" trapFocus offset={{ mainAxis: 10, crossAxis: 40 }}>
        <Popover.Target>{children}</Popover.Target>
        <Popover.Dropdown className={styles.window} h="80%" bg="#f0f0f0">
          <Text fw={700} size="xl" td="underline" m={20}>
            グループ一覧
          </Text>
          <TextInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            label="グループを検索"
            leftSection={<IconSearch />}
            m={20}
          />
          <ScrollArea h="70%">
            <Grid className={styles.groups} p={20} bg="white">
              {groupCards}
            </Grid>
          </ScrollArea>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}

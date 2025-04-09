"use client"

import styles from "./groupWindow.module.css"
import { Popover, ScrollArea } from "@mantine/core"
import { ReactNode } from "react"
import { Grid,GridCol,Text } from "@mantine/core";
import GroupCard from "@/components/ui/groupCard/GroupCard";

type Props={
  groups: {
    groupId: string;
    groupName: string;
  }[],
  children:ReactNode
}


export default function GroupsWindow({groups,children}:Props){
  const groupCards=groups.map((group)=>{
    return <GridCol key={group.groupId} span={{base:12,md:4}}>
        <GroupCard groupName={group.groupName} groupId={group.groupId}/>
      </GridCol>;
   })
  return (
    <>
      <Popover width="80%"  trapFocus offset={{ mainAxis: 10, crossAxis: 40 }} >
        <Popover.Target>{children}</Popover.Target>
        <Popover.Dropdown className={styles.window} h="80%" bg="#f0f0f0">
          <Text fw={700} size="xl" td="underline" m={20}>グループ一覧</Text>
          <ScrollArea h="80%">
            <Grid className={styles.groups} p={20} bg="white">
              {groupCards}
            </Grid>
          </ScrollArea>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
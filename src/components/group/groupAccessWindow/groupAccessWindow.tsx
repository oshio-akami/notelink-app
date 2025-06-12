"use client";

import JoinGroupForm from "@/components/group/joinGroupForm/joinGroupForm";
import CreateGroupForm from "@/components/group/createGroupForm/createGroupForm";
import { Tabs } from "@mantine/core";
import { useState } from "react";
import { IconPlus, IconUserPlus } from "@tabler/icons-react";
import styles from "./groupAccessWindow.module.scss";

export default function GroupAccessWindow() {
  const [disable, setDisable] = useState(false);
  return (
    <>
      <div className={styles.window}>
        <Tabs defaultValue="create" w="100%">
          <Tabs.List grow>
            <Tabs.Tab
              value="create"
              leftSection={<IconPlus />}
              disabled={disable}
            >
              グループを作成
            </Tabs.Tab>
            <Tabs.Tab
              value="join"
              leftSection={<IconUserPlus />}
              disabled={disable}
            >
              グループに参加
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="create">
            <CreateGroupForm disable={disable} setDisable={setDisable} />
          </Tabs.Panel>
          <Tabs.Panel value="join">
            <JoinGroupForm disable={disable} setDisable={setDisable} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}

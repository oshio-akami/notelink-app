"use client";

import JoinGroupForm from "@/components/group/joinGroupForm/joinGroupForm";
import CreateGroupForm from "@/components/group/createGroupForm/createGroupForm";
import { Button, Modal, Text, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { IconPlus, IconUserPlus } from "@tabler/icons-react";

export default function CreateGroupModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const [disable, setDisable] = useState(false);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        closeOnClickOutside={!disable}
        closeOnEscape={!disable}
        withCloseButton={!disable}
        size={"lg"}
        title={
          <Text fw={700} size="1.5rem">
            グループ
          </Text>
        }
      >
        <Tabs defaultValue="create">
          <Tabs.List grow>
            <Tabs.Tab value="create" leftSection={<IconPlus />}>
              グループを作成
            </Tabs.Tab>
            <Tabs.Tab value="join" leftSection={<IconUserPlus />}>
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
      </Modal>
      <Button onClick={open}>グループの作成・参加</Button>
    </>
  );
}

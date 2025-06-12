"use client";

import JoinGroupForm from "@/components/group/joinGroupForm/joinGroupForm";
import CreateGroupForm from "@/components/group/createGroupForm/createGroupForm";
import { Modal, Text, Tabs } from "@mantine/core";
import { useState } from "react";
import { IconPlus, IconUserPlus } from "@tabler/icons-react";

type Props = {
  opened: boolean;
  onClose?: () => void;
};

export default function GroupAccessModal({
  opened = false,
  onClose = () => {},
}: Props) {
  const [disable, setDisable] = useState(false);
  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
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
      </Modal>
    </>
  );
}

"use client";

import { Button, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import InviteLinkView from "../inviteLinkView/inviteLinkView";

type Props = {
  inviteToken: string;
};

export default function InviteLinkViewModel({ inviteToken }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size={"lg"}
        title={<Text fw={700}>他のユーザーを招待する</Text>}
      >
        <InviteLinkView inviteToken={inviteToken} />
      </Modal>
      <Button onClick={open} size="md">
        他のユーザーを招待する
      </Button>
    </>
  );
}

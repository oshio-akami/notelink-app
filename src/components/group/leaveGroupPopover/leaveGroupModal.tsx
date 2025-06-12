"use client";

import leaveGroup from "@/actions/group/leaveGroup";
import { Button, Text, Modal } from "@mantine/core";
import { useState } from "react";
import styles from "./leaveGroupModal.module.scss";
import { useRouter } from "next/navigation";
import { useGroup } from "@/libs/context/groupContext/groupContext";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function LeaveGroupModal({ opened, onClose }: Props) {
  const { groupId } = useGroup();
  const router = useRouter();
  const handleClick = async () => {
    setIsPending(true);
    await leaveGroup(groupId);
    router.push("/group/");
    onClose();
  };

  const [isPending, setIsPending] = useState(false);
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={!isPending}
      closeOnEscape={!isPending}
      withCloseButton={!isPending}
      centered
      w={200}
      title={
        <Text size="lg" fw={700}>
          退会する
        </Text>
      }
      size="sm"
    >
      <div className={styles.modal}>
        <div>
          <Text>本当にグループを退会しますか？</Text>
          <Text>退会すると投稿したコンテンツがすべて削除されます</Text>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            size="md"
            bg="white"
            variant="default"
            c="black"
            onClick={onClose}
            w="45%"
          >
            閉じる
          </Button>
          <Button size="md" w="45%" bg="red" onClick={handleClick}>
            {isPending ? "退会処理中..." : "退会する"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

"use client";

import deleteMember from "@/actions/group/deleteMember";
import { Button, Text, Modal } from "@mantine/core";
import { useState } from "react";
import styles from "./deleteMemberModal.module.scss";
import { UserProfile } from "@/utils/types/profileType";

type Props = {
  groupId: string;
  opened: boolean;
  onClose: () => void;
  userProfile: UserProfile;
};

export default function DeleteMemberModal({
  groupId,
  opened,
  onClose,
  userProfile,
}: Props) {
  const handleClick = async () => {
    setIsPending(true);
    await deleteMember(groupId, userProfile.userId!);
    window.location.reload();
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
      title={
        <Text size="lg" fw={700}>
          ユーザーをグループから削除
        </Text>
      }
      size="sm"
    >
      <div className={styles.modal}>
        <div>
          <Text>
            本当に{userProfile.displayName}をグループから削除しますか？
          </Text>
          <Text>
            ユーザーを削除するとそのユーザーが投稿したコンテンツがすべて削除されます
          </Text>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            size="md"
            w="45%"
            bg="white"
            variant="default"
            c="black"
            onClick={onClose}
            disabled={!isPending}
          >
            閉じる
          </Button>
          <Button size="md" w="45%" bg="red" onClick={handleClick}>
            {isPending ? "削除中..." : "削除"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

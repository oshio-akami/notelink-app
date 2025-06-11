"use client";

import { Button, Text, Modal } from "@mantine/core";
import styles from "./deleteMemberModal.module.scss";
import { UserProfile } from "@/utils/types/profileType";
import { useMemberActionsContext } from "@/libs/context/memberActionsContext/memberActionsContext";

type Props = {
  opened: boolean;
  onClose: () => void;
  userProfile: UserProfile;
};

export default function DeleteMemberModal({
  opened,
  onClose,
  userProfile,
}: Props) {
  const { handleDeleteMember } = useMemberActionsContext();
  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
          >
            閉じる
          </Button>
          <Button
            size="md"
            w="45%"
            bg="red"
            c="white"
            onClick={() => handleDeleteMember(userProfile.userId)}
          >
            削除する
          </Button>
        </div>
      </div>
    </Modal>
  );
}

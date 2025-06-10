import LeaveGroupModal from "@/components/group/leaveGroupPopover/leaveGroupModal";
import { Popover, Text } from "@mantine/core";
import { ReactNode } from "react";
import { IconUserMinus } from "@tabler/icons-react";
import styles from "./memberPopup.module.scss";
import { useDisclosure } from "@mantine/hooks";
import DeleteMemberModal from "../deleteMemberModal/deleteMemberModal";
import { UserProfile } from "@/utils/types/profileType";
import { useGroup } from "@/libs/context/groupContext/groupContext";

type Props = {
  children: ReactNode;
  viewerIsAdmin: boolean;
  isOwnProfile: boolean;
  userProfile: UserProfile;
};

export default function MemberPopup({
  children,
  viewerIsAdmin,
  isOwnProfile,
  userProfile,
}: Props) {
  const { groupId } = useGroup();
  const [
    leaveGroupModalOpened,
    { open: openLeaveGroupModal, close: closeLeaveGroupModal },
  ] = useDisclosure(false);
  const [
    deleteMemberModalOpened,
    { open: openedDeleteMemberModal, close: closeDeleteMemberModal },
  ] = useDisclosure(false);
  return (
    <>
      {!leaveGroupModalOpened && !deleteMemberModalOpened ? (
        <Popover trapFocus offset={{ mainAxis: 10, crossAxis: 40 }}>
          <Popover.Target>{children}</Popover.Target>
          <Popover.Dropdown className={styles.popup}>
            <ul>
              {isOwnProfile && (
                <li>
                  <IconUserMinus color="red" />
                  <Text c="red" onClick={openLeaveGroupModal}>
                    グループを退会
                  </Text>
                </li>
              )}
              {viewerIsAdmin && !isOwnProfile && (
                <li>
                  <IconUserMinus color="red" />
                  <Text c="red" onClick={openedDeleteMemberModal}>
                    メンバーを削除
                  </Text>
                </li>
              )}
            </ul>
          </Popover.Dropdown>
        </Popover>
      ) : (
        children
      )}
      <LeaveGroupModal
        groupId={groupId}
        opened={leaveGroupModalOpened}
        onClose={closeLeaveGroupModal}
      />
      <DeleteMemberModal
        groupId={groupId}
        opened={deleteMemberModalOpened}
        onClose={closeDeleteMemberModal}
        userProfile={userProfile}
      />
    </>
  );
}

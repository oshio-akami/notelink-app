"use client";

import styles from "./header.module.scss";
import { ProfileWindow } from "@/components/auth/profileWindow/profileWindow";
import { Burger, Button, Image, Text, useMantineTheme } from "@mantine/core";
import GroupAccessModal from "@/components/group/groupAccessModal/groupAccessModal";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useProfile } from "@/libs/hooks/user";
import { useGroup } from "@/libs/context/groupContext/groupContext";
import IconButton from "@/components/shared/iconButton/iconButton";
import { IconUsersGroup } from "@tabler/icons-react";

export const runtime = "edge";

function sliceText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }
  if (maxLength <= 3) {
    return text.slice(0, maxLength);
  }
  return text.slice(0, maxLength - 3) + "...";
}

type Props = {
  burgerOpened: boolean;
  onClickBurger: () => void;
};

export function Header({ burgerOpened, onClickBurger }: Props) {
  const { groupId, groupName } = useGroup();
  const { profile } = useProfile(groupId);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <Burger
          opened={burgerOpened}
          onClick={onClickBurger}
          hiddenFrom="sm"
          size="sm"
        />
        <Image
          className={styles.logo}
          w={150}
          src="https://pub-0e85cec67fe344ccb5094d3659571d7d.r2.dev/sample_logo.png"
          alt="logo"
        />
        <Text>{sliceText(groupName, 10)}</Text>
      </div>
      <div className={styles.rightSection}>
        {profile && profile !== undefined && (
          <ProfileWindow name={profile.displayName} icon={profile.image}>
            {profile.image !== "" ? (
              <Image className={styles.userIcon} alt="" src={profile.image} />
            ) : (
              <Image
                className={styles.userIcon}
                src="https://ui-avatars.com/api/?name=Guest&background=cccccc&color=ffffff&rounded=true"
                alt="ゲストアイコン"
              />
            )}
          </ProfileWindow>
        )}
        {isMobile ? (
          <IconButton
            icon={<IconUsersGroup size="1rem" />}
            onClick={open}
            border
          />
        ) : (
          <Button onClick={open}>グループの作成・参加</Button>
        )}

        <GroupAccessModal opened={opened} onClose={close} />
      </div>
    </div>
  );
}

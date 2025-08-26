"use client";

import styles from "./header.module.scss";
import { ProfileWindow } from "@/components/auth/profileWindow/profileWindow";
import { Avatar, Burger, Button, Image, useMantineTheme } from "@mantine/core";
import GroupAccessModal from "@/components/group/groupAccessModal/groupAccessModal";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import IconButton from "@/components/shared/iconButton/iconButton";
import { IconUsersGroup } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export const runtime = "edge";
type Props = {
  burgerOpened: boolean;
  onClickBurger: () => void;
};

export function Header({ burgerOpened, onClickBurger }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { data: session } = useSession();
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
          onClick={() => redirect("/home")}
          w={150}
          src="/sample_logo.webp"
          alt="logo"
        />
      </div>
      <div className={styles.rightSection}>
        {session?.user && session.user !== undefined && (
          <ProfileWindow name={session.user.name!} icon={session.user.image!}>
            {session.user.image !== "" ? (
              <Avatar alt="userIcon" src={session.user.image} size="2.5rem" />
            ) : (
              <Avatar
                src="https://ui-avatars.com/api/?name=Guest&background=cccccc&color=ffffff&rounded=true"
                alt="guestIcon"
                size="2.5rem"
              />
            )}
          </ProfileWindow>
        )}
        {isMobile ? (
          <IconButton
            icon={<IconUsersGroup size="2rem" />}
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

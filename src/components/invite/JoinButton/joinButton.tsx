"use client";

import joinInviteGroup from "@/actions/group/joinInviteGroup";
import { Button, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./joinButotn.module.scss";

type Props = {
  inviteToken: string;
};

export default function JoinButton({ inviteToken }: Props) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    await joinInviteGroup(inviteToken);
    setLoading(false);
  };
  return (
    <Button onClick={handleClick} className={styles.button}>
      <Text>{loading ? "参加中..." : "グループに参加する "}</Text>
      <IconArrowRight />
    </Button>
  );
}

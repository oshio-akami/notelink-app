"use client";

import joinInviteGroup from "@/actions/group/joinInviteGroup";
import { Button } from "@mantine/core";
import { useState } from "react";

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
    <Button onClick={handleClick}>{loading ? "参加中..." : "参加する"}</Button>
  );
}

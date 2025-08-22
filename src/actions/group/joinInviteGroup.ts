"use server";

import { getClient } from "@/libs/hono";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasJoinedGroup } from "@/libs/apiUtils";

export default async function joinInviteGroup(inviteToken: string) {
  const client = await getClient();
  const res = await client.api.invite.validate[":token"].$get({
    param: {
      token: inviteToken,
    },
  });
  const validate = await res.json();
  if (!validate.success) {
    return validate.message;
  }
  const session = await auth();
  if (!session?.user?.id) {
    return "ユーザー存在しません";
  }
  if (!validate.message) {
    return "招待コードが存在しません";
  }
  const hasJoin = await hasJoinedGroup(validate.message);
  if (hasJoin) {
    return "すでにグループに参加しています";
  }
  await client.api.user.join[":groupId"].$post({
    param: {
      groupId: validate.message,
    },
    json: {
      roleId: 2,
    },
  });
  redirect("/home");
}

"use server";

import { getClient } from "@/libs/hono";

export default async function leaveGroup(groupId: string) {
  const client = await getClient();
  const res = await client.api.user[":groupId"].$delete({
    param: {
      groupId: groupId,
    },
  });
  if (!res.ok) {
    throw new Error("グループの退会に失敗しました");
  }
  const body = await res.json();
  if (!body.success) {
    throw new Error("サーバーから失敗レスポンスが返されました");
  }
}

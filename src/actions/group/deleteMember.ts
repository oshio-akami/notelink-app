"use server";

import { getClient } from "@/libs/hono";

export default async function deleteMember(groupId: string, userId: string) {
  const client = await getClient();
  const res = await client.api.group[":groupId"].user[":userId"].$delete({
    param: {
      groupId: groupId,
      userId: userId,
    },
  });
  if (!res.ok) {
    throw new Error("メンバーの削除に失敗しました");
  }
  const body = await res.json();
  if (!body.success) {
    return new Error("サーバーから失敗レスポンスが返されました");
  }
  return { success: true };
}

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
  const body = await res.json();
  if (!body.deleted || body.deleted.length === 0) {
    return false;
  }
  return true;
}

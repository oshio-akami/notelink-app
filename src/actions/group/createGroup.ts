"use server";

import { getClient } from "@/libs/hono";
import { parseWithZod } from "@conform-to/zod";
import { createGroupFormSchema } from "@/utils/types/formSchema";
import { redirect } from "next/navigation";

export async function createGroup(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: createGroupFormSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const client = await getClient();
  const res = await client.api.group.create.$post({
    json: {
      groupName: submission.value.groupName,
    },
  });
  const body = await res.json();
  const groupId = body.created?.groupId;
  if (!groupId) {
    return { success: false };
  }

  await client.api.user.currentGroup[":groupId"].$patch({
    param: {
      groupId: groupId,
    },
  });
  redirect(`${process.env.NEXT_PUBLIC_URL}/group/${groupId}/home`);
}

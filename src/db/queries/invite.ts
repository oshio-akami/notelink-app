import { eq } from "drizzle-orm";
import { db } from "..";
import { groupInvites } from "../schema";

/**トークンから招待トークンの情報を取得する */
export async function findInviteTokenQuery(token: string) {
  return await db
    .select({ groupInvites })
    .from(groupInvites)
    .where(eq(groupInvites.token, token))
    .limit(1);
}

/**招待トークンを挿入する */
export async function insertInviteTokenQuery(groupId: string) {
  return await db
    .insert(groupInvites)
    .values({
      groupId: groupId,
    })
    .returning();
}

/**グループIDから招待トークンの情報を取得する */
export async function findInviteDataQuery(groupId: string) {
  return await db
    .select({ groupInvites })
    .from(groupInvites)
    .where(eq(groupInvites.groupId, groupId))
    .orderBy(groupInvites.createdAt)
    .limit(1);
}

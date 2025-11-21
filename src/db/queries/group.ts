import { db } from "@/db/index";
import { groupMembers, roles, groups, userProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**グループのメンバー一覧を取得 */
export async function findGroupMembers(groupId: string) {
  return await db
    .select({
      userId: groupMembers.userId,
      displayName: userProfiles.displayName,
      image: userProfiles.image,
      role: roles.roleName,
    })
    .from(groupMembers)
    .innerJoin(userProfiles, eq(groupMembers.userId, userProfiles.userId))
    .innerJoin(roles, eq(groupMembers.roleId, roles.roleId))
    .where(eq(groupMembers.groupId, groupId))
    .orderBy(groupMembers.roleId);
}

/**グループIDからグループの情報取得 */
export async function findGroup(groupId: string) {
  const result = await db
    .select()
    .from(groups)
    .where(eq(groups.groupId, groupId))
    .limit(1);
  return result[0] ?? null;
}

/**グループIDからグループ名を取得 */
export async function findGroupName(
  groupId: string
): Promise<{ groupName: string } | null> {
  const result = await db
    .select({ groupName: groups.groupName })
    .from(groups)
    .where(eq(groups.groupId, groupId))
    .limit(1);
  return result[0] ?? null;
}

/**グループを作成 */
export async function insertGroup(
  groupName: string
): Promise<{ groupId: string; groupName: string } | null> {
  const result = await db
    .insert(groups)
    .values({
      groupName: groupName,
    })
    .returning();
  return result[0] ?? null;
}

/**adminとしてグループに加入させる */
export async function insertAdminToGroup(
  userId: string,
  groupId: string
): Promise<{ userId: string; groupId: string; roleId: number } | null> {
  const result = await db
    .insert(groupMembers)
    .values({
      userId: userId,
      groupId: groupId,
      roleId: 1,
    })
    .returning();
  return result[0] ?? null;
}
/**メンバーとしてグループに加入させる */
export async function insertMemberToGroup(
  userId: string,
  groupId: string
): Promise<{ userId: string; groupId: string; roleId: number } | null> {
  const result = await db
    .insert(groupMembers)
    .values({
      userId: userId,
      groupId: groupId,
      roleId: 2,
    })
    .returning();
  return result[0] ?? null;
}

/**メンバーをグループから削除 */
export async function deleteMemberToGroup(userId: string, groupId: string) {
  const result = await db
    .delete(groupMembers)
    .where(
      and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId))
    );
  return result;
}

/**ユーザーのロールを取得 */
export async function findUserRoleId(
  userId: string,
  groupId: string
): Promise<{ roleId: number } | null> {
  const result = await db
    .select({ roleId: groupMembers.roleId })
    .from(groupMembers)
    .where(
      and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId))
    )
    .limit(1);
  return result[0] ?? null;
}

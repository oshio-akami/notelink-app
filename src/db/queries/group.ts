import { db } from "@/db/index";
import { groupMembers, roles, groups, userProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**グループのメンバー一覧を取得 */
export async function findGroupMembersById(groupId: string) {
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
export async function findGroupById(groupId: string) {
  const result = await db
    .select()
    .from(groups)
    .where(eq(groups.groupId, groupId))
    .limit(1);
  return result[0] ?? null;
}

/**グループIDからグループ名を取得 */
export async function findGroupNameById(groupId: string) {
  const result = await db
    .select({ groupName: groups.groupName })
    .from(groups)
    .where(eq(groups.groupId, groupId))
    .limit(1);
  return result[0] ?? null;
}

/**グループを作成 */
export async function insertGroup(groupName: string) {
  const result = await db
    .insert(groups)
    .values({
      groupName: groupName,
    })
    .returning();
  return result[0] ?? null;
}

/**adminとしてグループに加入させる */
export async function insertAdminToGroup(userId: string, groupId: string) {
  await db
    .insert(groupMembers)
    .values({
      userId: userId,
      groupId: groupId,
      roleId: 1,
    })
    .returning();
}
/**メンバーとしてグループに加入させる */
export async function insertMemberToGroup(userId: string, groupId: string) {
  await db
    .insert(groupMembers)
    .values({
      userId: userId,
      groupId: groupId,
      roleId: 2,
    })
    .returning();
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

export async function findUserRoleId(userId: string, groupId: string) {
  const result = await db
    .select({ roleId: groupMembers.roleId })
    .from(groupMembers)
    .where(
      and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId))
    )
    .limit(1);
  return result[0] ?? null;
}

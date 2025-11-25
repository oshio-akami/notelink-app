import { and, count, eq, max, sql } from "drizzle-orm";
import { articles, groupMembers, groups, userProfiles } from "../schema";
import { db } from "..";

export async function hasJoinedGroupQuery(userId: string, groupId: string) {
  return await db
    .select()
    .from(groupMembers)
    .where(
      and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId))
    )
    .limit(1);
}

export async function findUserProfileQuery(userId: string) {
  return await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);
}

export async function findGroupUserProfileQuery(
  userId: string,
  groupId: string
) {
  return await db
    .select({
      userId: userProfiles.userId,
      image: userProfiles.image,
      displayName: userProfiles.displayName,
      roleId: groupMembers.roleId,
      groupId: groupMembers.groupId,
    })
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .innerJoin(
      groupMembers,
      and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId))
    )
    .limit(1);
}

export async function updateCurrentGroupQuery(userId: string, groupId: string) {
  return await db
    .update(userProfiles)
    .set({ currentGroupId: groupId })
    .where(eq(userProfiles.userId, userId))
    .returning();
}

export async function findGroupsQuery(userId: string) {
  return await db
    .select({
      groupId: groups.groupId,
      groupName: groups.groupName,
    })
    .from(groupMembers)
    .innerJoin(groups, eq(groupMembers.groupId, groups.groupId))
    .where(eq(groupMembers.userId, userId))
    .orderBy(groups.groupName);
}

export async function findGroupSummariesQuery(userId: string) {
  return await db
    .select({
      groupId: groups.groupId,
      groupName: groups.groupName,
      postCount: count(articles.id).mapWith(Number),
      lastPostAt: max(articles.createdAt),
      memberCount: sql<number>`(SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = groups.group_id)`,
    })
    .from(groups)
    .innerJoin(groupMembers, eq(groupMembers.groupId, groups.groupId))
    .leftJoin(articles, eq(articles.groupId, groups.groupId))
    .where(eq(groupMembers.userId, userId))
    .groupBy(groups.groupId)
    .orderBy(groups.groupName);
}

export async function deleteUserToGroupQuery(userId: string, groupId: string) {
  return await db
    .delete(groupMembers)
    .where(
      and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId))
    )
    .returning();
}

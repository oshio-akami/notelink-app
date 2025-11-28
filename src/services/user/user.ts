import {
  insertAdminToGroupQuery,
  insertMemberToGroupQuery,
} from "@/db/queries/group";
import {
  deleteUserToGroupQuery,
  findGroupsQuery,
  findGroupSummariesQuery,
  findGroupUserProfileQuery,
  findUserProfileQuery,
  hasJoinedGroupQuery,
  updateCurrentGroupQuery,
} from "@/db/queries/user";
import { withGroupMemberCheck } from "../withGroupMemberCheck";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";

/**ユーザーがグループに参加しているかどうか確認する */
export async function hasJoinedGroupService(groupId: string) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  const hasJoinedGroup = await hasJoinedGroupQuery(userId, groupId);
  return { hasJoinedGroup: hasJoinedGroup.length > 0 };
}

/**グループに参加する */
export async function joinGroupService(groupId: string, roleId: number) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  const joinedGroup =
    roleId === 1
      ? await insertAdminToGroupQuery(userId, groupId)
      : await insertMemberToGroupQuery(userId, groupId);
  if (length === 0) {
    throw new Error();
  }
  return { joinedGroup: joinedGroup[0] };
}

/**現在のグループを更新する */
export async function setCurrentGroupService(groupId: string) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setCurrentGroup = await updateCurrentGroupQuery(userId, groupId);
  if (setCurrentGroup.length === 0) {
    throw new Error();
  }
  return { success: true };
}

/**現在のグループを取得する */
export async function getCurrentGroupService() {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  const userProfile = await findUserProfileQuery(userId);
  if (userProfile.length === 0) {
    const joinedGroups = await findGroupsQuery(userId);
    if (joinedGroups.length === 0) {
      throw new NotFoundError();
    }
    const updateCurrentGroup = await updateCurrentGroupQuery(
      userId,
      joinedGroups[0].groupId
    );
    if (updateCurrentGroup.length === 0) {
      throw new Error();
    }
    return { currentGroupId: updateCurrentGroup[0].currentGroupId };
  }
  return { currentGroupId: userProfile[0].currentGroupId };
}

/**グループ一覧を取得する */
export async function getGroupsService() {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  const groups = await findGroupsQuery(userId);
  return { groups: groups };
}

/**グループのサマリ一覧を取得する */
export async function getGroupSummariesService() {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  const groupSummaries = await findGroupSummariesQuery(userId);
  return { groupSummaries: groupSummaries };
}

/**グループから退会する */
export async function leaveGroupService(groupId: string) {
  const check = await withGroupMemberCheck(groupId);
  const deleted = await deleteUserToGroupQuery(check.userId, groupId);
  const success = deleted.length !== 0;
  if (!success) {
    throw new Error();
  }
}

/**グループ内でのユーザーのプロフィールを取得する */
export async function getGroupUserProfileService(groupId: string) {
  const check = await withGroupMemberCheck(groupId);
  const profile = await findGroupUserProfileQuery(check.userId, groupId);
  if (profile.length === 0) {
    throw new NotFoundError();
  }
  return { groupProfile: profile[0] };
}

/**ユーザーのプロフィールを取得する */
export async function getUserProfileService() {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  const profile = await findUserProfileQuery(userId);
  if (profile.length === 0) {
    throw new NotFoundError();
  }
  return { profile: profile[0] };
}

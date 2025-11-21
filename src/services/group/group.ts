import {
  deleteMemberToGroup,
  findGroup,
  findGroupMembers,
  findUserRoleId,
  insertAdminToGroup,
  insertGroup,
} from "@/db/queries/group";
import { withGroupMemberCheck } from "@/libs/apiUtils";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { ForbiddenError, NotFoundError } from "@/utils/errors";
import { ROLE_ADMIN } from "@/libs/roleUtils";

/**指定したグループIDのメンバー一覧を取得する */
export async function getGroupMembersService(groupId: string) {
  const check = await withGroupMemberCheck(groupId);
  if (!check.success) {
    throw new ForbiddenError();
  }
  const members = await findGroupMembers(groupId);
  if (!members || members.length == 0) {
    throw new NotFoundError();
  }
  return { members: members };
}

/**指定した名前のグループを作成してユーザーをAdminとしてグループに追加する*/
export async function createGroupService(groupName: string) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new ForbiddenError();
  }
  const createdGroup = await insertGroup(groupName);
  if (!createdGroup) {
    throw new NotFoundError();
  }
  await insertAdminToGroup(userId, createdGroup.groupId);
  return { createdGroup: createdGroup };
}

/**指定したグループIDのグループ情報を取得する */
export async function getGroupService(groupId: string) {
  const group = await findGroup(groupId);
  if (!group) {
    throw new NotFoundError();
  }
  return { group: group };
}

/**指定したグループからユーザーを削除する */
export async function deleteMembersService(userId: string, groupId: string) {
  //ユーザの役職取得
  const check = await withGroupMemberCheck(groupId);
  if (!check.success) {
    throw new ForbiddenError();
  }
  const role = await findUserRoleId(check.userId, groupId);
  if (!role || !role.roleId === undefined) {
    throw new NotFoundError();
  }
  //役職がadminの場合のみ削除
  if (role.roleId !== ROLE_ADMIN) {
    throw new ForbiddenError();
  }

  const deleted = await deleteMemberToGroup(userId, groupId);
  const success = deleted.rowCount > 0;
  if (!success) {
    throw new NotFoundError();
  }
  return { success: true };
}

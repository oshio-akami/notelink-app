import {
  findInviteDataQuery,
  findInviteTokenQuery,
  insertInviteTokenQuery,
} from "@/db/queries/invite";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";
import { hasJoinedGroupService } from "../user/user";

/**トークンが有効か確認し有効ならグループIDを返す */
export async function validateTokenService(token: string) {
  const tokenData = await findInviteTokenQuery(token);
  if (tokenData.length === 0) {
    throw new NotFoundError();
  }
  const { expiresAt } = tokenData[0].groupInvites;
  const currentDate = new Date();
  if (expiresAt < currentDate) {
    throw new NotFoundError();
  }
  return { groupId: tokenData[0].groupInvites.groupId };
}

/**招待トークンを作成する */
export async function createInviteTokenService(groupId: string) {
  const hasJoined = await hasJoinedGroupService(groupId);
  if (!hasJoined.hasJoinedGroup) {
    throw new UnauthorizedError();
  }
  const created = await insertInviteTokenQuery(groupId);
  if (created.length === 0) {
    throw new NotFoundError();
  }
  return { token: created[0].token };
}

/**グループIDから招待トークンを取得する */
export async function getInviteTokenService(groupId: string) {
  const hasJoined = await hasJoinedGroupService(groupId);
  if (!hasJoined.hasJoinedGroup) {
    throw new UnauthorizedError();
  }
  const inviteData = await findInviteDataQuery(groupId);
  if (inviteData.length === 0) {
    throw new NotFoundError();
  }
  const { token, expiresAt } = inviteData[0].groupInvites;
  const currentDate = new Date();
  if (!token) {
    throw new NotFoundError();
  }
  if (expiresAt < currentDate) {
    throw new NotFoundError();
  }
  return { token: token };
}

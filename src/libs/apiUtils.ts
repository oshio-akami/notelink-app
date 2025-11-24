import { auth } from "@/auth";
import { getClient } from "./hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { ForbiddenError, UnauthorizedError } from "@/utils/errors";

/**指定されたグループのメンバーであるかをチェックする関数 */
export const hasJoinedGroup = async (groupId: string) => {
  const client = await getClient();
  const res = await client.api.user.hasJoined[":groupId"].$get({
    param: {
      groupId: groupId,
    },
  });
  const body = await res.json();
  return body.hasJoinedGroup;
};

export type CheckResult =
  | { success: true; userId: string }
  | { success: false; status: ContentfulStatusCode };

/**
 * 指定されたグループのメンバーであるかをチェックする関数
 * @returns
 * ユーザーが未認証、またはユーザーがグループに参加していない場合: エラー
 * チェックに成功した場合: { success: true, userId }
 */
export const withGroupMemberCheck = async (groupId: string) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }
  const hasJoined = await hasJoinedGroup(groupId);
  if (!hasJoined) {
    throw new ForbiddenError();
  }
  return { success: true, userId: userId };
};

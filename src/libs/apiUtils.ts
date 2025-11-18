import { auth } from "@/auth";
import { getClient } from "./hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

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
 * ユーザーが未認証、またはユーザーがグループに参加していない場合: { success: false, status:number }
 * チェックに成功した場合: { success: true, userId }
 */
export const withGroupMemberCheck = async (
  groupId: string
): Promise<CheckResult> => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, status: 401 };
  }
  const hasJoined = await hasJoinedGroup(groupId);
  if (!hasJoined) {
    return { success: false, status: 403 };
  }
  return { success: true, userId: userId };
};

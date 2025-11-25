import { auth } from "@/auth";
import { ForbiddenError, UnauthorizedError } from "@/utils/errors";
import { hasJoinedGroupService } from "./user/user";

/**指定されたグループのメンバーであるかをチェックする関数
 */
export const withGroupMemberCheck = async (groupId: string) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }
  const hasJoined = await hasJoinedGroupService(groupId);
  if (!hasJoined) {
    throw new ForbiddenError();
  }
  return { success: true, userId: userId };
};

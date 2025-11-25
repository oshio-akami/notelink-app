import { getClient } from "./hono";

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

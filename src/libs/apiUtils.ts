import { getClient } from "./hono";

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

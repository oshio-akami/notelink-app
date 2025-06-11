import deleteMember from "@/actions/group/deleteMember";
import client from "@/libs/honoClient";
import useSWR from "swr";

/**メンバー情報を取得するカスタムフック */
export const useMember = (groupId: string) => {
  const fetcher = async () => {
    const res = await client.api.group.members[":groupId"].$get({
      param: {
        groupId: groupId,
      },
    });
    const body = await res.json();
    return body.members ?? [];
  };

  const key = `/members/${groupId}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  /**メンバーを削除する関数 */
  const handleDeleteMember = async (userId: string) => {
    console.log("userid:" + userId);
    console.log("groupId:" + groupId);
    mutate((prev) => prev?.filter((member) => member.userId !== userId), false);
    try {
      await deleteMember(groupId, userId);
    } catch {
      mutate();
    }
  };

  return {
    members: data,
    isLoading,
    error,
    mutate,
    handleDeleteMember,
  };
};

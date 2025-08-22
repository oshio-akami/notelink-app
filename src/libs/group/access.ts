/**現在のグループ情報からリダイレクト先のurlを決定 */
export const determineRedirect = (
  hasJoinedCurrentGroup: boolean,
  joinedGroups: { groupId: string }[]
) => {
  if (hasJoinedCurrentGroup) {
    return null;
  }
  if (joinedGroups.length > 0) {
    return `/home`;
  }

  return "/join-group";
};

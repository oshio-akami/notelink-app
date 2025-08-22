import styles from "./page.module.scss";
import { redirect } from "next/navigation";
import { hasJoinedGroup } from "@/libs/apiUtils";
import { getClient } from "@/libs/hono";
import GroupAccessWindow from "@/components/group/groupAccessWindow/groupAccessWindow";
import { Image, Text } from "@mantine/core";

export const runtime = "edge";

const getCurrentGroup = async () => {
  const client = await getClient();
  const res = await client.api.user.currentGroup.$get();
  const body = await res.json();
  return body.currentGroup;
};
const getGroups = async () => {
  const client = await getClient();
  const res = await client.api.user.groups.$get();
  const body = await res.json();
  return body.groups;
};

export default async function Page() {
  const currentGroup = await getCurrentGroup();
  if (currentGroup) {
    const hasJoined = await hasJoinedGroup(currentGroup);
    if (hasJoined) {
      redirect("/home");
    }
  }
  const groups = await getGroups();
  if (groups && groups.length > 0) {
    const client = await getClient();
    await client.api.user.currentGroup[":groupId"].$patch({
      param: {
        groupId: groups[0].groupId,
      },
    });
    redirect("/home");
  }
  return (
    <div className={styles.wrapper}>
      <Image src="sample_logo.png" alt="logo" w={150} />
      <div className={styles.description}>
        <Text>NoteLinkへようこそ！</Text>
        <Text>あなたはまだグループに参加していません。</Text>
        <Text>
          グループを作成するか、招待コードを使って既存のグループに参加してみましょう！
        </Text>
      </div>
      <GroupAccessWindow />
    </div>
  );
}

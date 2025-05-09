import styles from "./page.module.css";
import { redirect } from "next/navigation";
import { hasJoinedGroup } from "@/libs/apiLibs";
import { getClient } from "@/libs/hono";
import CreateGroupForm from "@/components/group/createGroupForm/createGroupForm";
import JoinGroupForm from "@/components/group/joinGroupForm/joinGroupForm";

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
      redirect(`/group/${currentGroup}/home`);
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
    redirect(`group/${groups[0].groupId}/home`);
  }
  return (
    <div className={styles.formWrapper}>
      <CreateGroupForm onPendingChange={() => {}} />
      <JoinGroupForm />
    </div>
  );
}

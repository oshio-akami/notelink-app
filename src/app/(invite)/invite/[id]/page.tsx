import styles from "./page.module.css";
import { hasJoinedGroup } from "@/libs/apiUtils";
import setCurrentGroup from "@/actions/user/setCurrentGroup";
import { getClient } from "@/libs/hono";
import InviteWindow from "@/components/invite/inviteWindow/inviteWindow";

type Props = {
  params: Promise<{ id: string }>;
};

const validate = async (token: string) => {
  const client = await getClient();
  const res = await client.api.invite.validate[":token"].$get({
    param: {
      token: token,
    },
  });
  const body = await res.json();
  return body;
};
const getGroupName = async (groupId: string) => {
  const client = await getClient();
  const res = await client.api.group[":groupId"].name.$get({
    param: {
      groupId: groupId,
    },
  });
  const body = await res.json();
  return body.groupName;
};

export default async function Invite({ params }: Props) {
  const { id } = await params;
  const validateToken = await validate(id);
  if (!validateToken.success || !validateToken.message) {
    return (
      <div className={styles.page}>
        <div className={styles.box}>
          <p>{validateToken.message}</p>
        </div>
      </div>
    );
  }
  const groupId = validateToken.message;
  const hasJoined = await hasJoinedGroup(groupId);
  if (hasJoined) {
    await setCurrentGroup(groupId);
  }
  const groupName = await getGroupName(groupId);
  return <InviteWindow groupName={groupName!} inviteToken={id} />;
}

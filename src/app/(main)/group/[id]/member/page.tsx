import InviteInfo from "@/components/invite/inviteInfo/InviteInfo";
import MemberList from "@/components/group/memberList/MemberList";
import { getClient } from "@/libs/hono";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

const getInviteToken = async (groupId: string) => {
  const client = await getClient();
  const res = await client.api.invite.token[":groupId"].$get({
    param: {
      groupId: groupId,
    },
  });
  const body = await res.json();
  return body.token;
};
const createInviteToken = async (groupId: string) => {
  const client = await getClient();
  const res = await client.api.invite.token[":groupId"].$post({
    param: {
      groupId: groupId,
    },
  });
  const body = await res.json();
  return body.token;
};

const getInviteData = async (groupId: string) => {
  const token = await getInviteToken(groupId);
  if (!token) {
    const newToken = await createInviteToken(groupId);
    return newToken ?? "";
  }
  return token;
};
const getMembers = async (groupId: string) => {
  const client = await getClient();
  const res = await client.api.group.members[":groupId"].$get({
    param: {
      groupId: groupId,
    },
  });
  const body = await res.json();
  return body.members;
};

export default async function Member({ params }: Props) {
  const { id } = await params;
  const members = await getMembers(id);
  const inviteToken = await getInviteData(id);

  return (
    <>
      <InviteInfo inviteToken={inviteToken} />
      <MemberList members={members} />
    </>
  );
}

import MemberList from "@/components/member/memberList/memberList";
import { getClient } from "@/libs/hono";
import InviteLinkViewModel from "@/components/invite/inviteLinkViewModal/InviteLinkViewModal";
import { AppShellAside, Flex } from "@mantine/core";
import styles from "./page.module.scss";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { UserProfile } from "@/utils/types/profileType";

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
const getMembers = async (groupId: string): Promise<UserProfile[]> => {
  const client = await getClient();
  const res = await client.api.group.members[":groupId"].$get({
    param: {
      groupId: groupId,
    },
  });
  const body = await res.json();
  return body.members ?? [];
};

export default async function Member({ params }: Props) {
  const { id } = await params;
  const members = await getMembers(id);
  const inviteToken = await getInviteData(id);
  const userId = await getSessionUserId();
  const viewer = members?.find((member) => member.userId === userId);

  return (
    <div className={styles.wrapper}>
      <Flex justify="flex-end">
        <InviteLinkViewModel inviteToken={inviteToken} />
      </Flex>
      <MemberList
        members={members}
        viewerIsAdmin={(viewer && viewer.role === "admin") ?? false}
      />
      <AppShellAside p={20} withBorder={false} zIndex={-1} bg={"#f8fbff"}>
        <></>
      </AppShellAside>
    </div>
  );
}

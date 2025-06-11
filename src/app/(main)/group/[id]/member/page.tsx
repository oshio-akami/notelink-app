import MemberList from "@/components/member/memberList/memberList";
import { getClient } from "@/libs/hono";
import InviteLinkViewModel from "@/components/invite/inviteLinkViewModal/InviteLinkViewModal";
import { AppShellAside, Flex } from "@mantine/core";
import styles from "./page.module.scss";

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

export default async function Member({ params }: Props) {
  const { id } = await params;
  const inviteToken = await getInviteData(id);

  return (
    <div className={styles.wrapper}>
      <Flex justify="flex-end">
        <InviteLinkViewModel inviteToken={inviteToken} />
      </Flex>
      <MemberList />
      <AppShellAside p={20} withBorder={false} zIndex={-1} bg={"#f8fbff"}>
        <></>
      </AppShellAside>
    </div>
  );
}

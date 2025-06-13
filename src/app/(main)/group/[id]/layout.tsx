import type { Metadata } from "next";
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import { GroupContextProvider } from "@/libs/context/groupContext/groupContextProvider";
import { getClient } from "@/libs/hono";
import ClientAppShell from "@/components/layout/clientAppShell/clientAppShell";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "project",
  description: "project",
};

type Props = {
  params: { id: string };
  children: Readonly<React.ReactNode>;
};

export default async function RootLayout(props: Props) {
  const { id } = await props.params;
  const getGroupName = async () => {
    const client = await getClient();
    const res = await client.api.group[":groupId"].name.$get({
      param: {
        groupId: id,
      },
    });
    const body = await res.json();
    return body.groupName;
  };
  const groupName = await getGroupName();
  return (
    <GroupContextProvider groupId={id} groupName={groupName!}>
      <ClientAppShell>{props.children}</ClientAppShell>
    </GroupContextProvider>
  );
}

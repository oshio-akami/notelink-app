import type { Metadata } from "next";
import { GroupContextProvider } from "@/libs/context/groupContext/groupContextProvider";
import { getClient } from "@/libs/hono";
import ClientAppShellWithGroup from "@/components/layout/clientAppShell/clientAppShellWithGroup";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "グループ - NoteLink",
  description: "グループページ",
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
      <ClientAppShellWithGroup>{props.children}</ClientAppShellWithGroup>
    </GroupContextProvider>
  );
}

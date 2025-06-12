import type { Metadata } from "next";
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";
import { NavBar } from "@/components/layout/navbar/navbar";
import { Header } from "@/components/layout/header/header";
import { GroupContextProvider } from "@/libs/context/groupContext/groupContextProvider";
import { getClient } from "@/libs/hono";

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
      <AppShell
        header={{ height: "60px" }}
        navbar={{
          width: "300px",
          breakpoint: "600px",
          collapsed: { desktop: false, mobile: true },
        }}
        aside={{
          width: "500px",
          breakpoint: "1400px",
          collapsed: { desktop: false, mobile: true },
        }}
      >
        <AppShellHeader>
          <Header />
        </AppShellHeader>
        <AppShellNavbar>
          <NavBar id={id} />
        </AppShellNavbar>
        <AppShellMain bg={"#f8fbff"}>{props.children}</AppShellMain>
      </AppShell>
    </GroupContextProvider>
  );
}

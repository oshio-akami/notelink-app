import type { Metadata } from "next";
import ClientAppShell from "@/components/layout/clientAppShell/clientAppShell";
export const runtime = "edge";

export const metadata: Metadata = {
  title: "ホーム - NoteLink",
  description: "NoteLink",
};

type Props = {
  children: Readonly<React.ReactNode>;
};

export default async function RootLayout(props: Props) {
  return <ClientAppShell>{props.children}</ClientAppShell>;
}

import { LoginForm } from "@/components/auth/loginForm/loginForm";
import { redirect } from "next/navigation";
import { getClient } from "@/libs/hono";
import { auth } from "@/auth";

export const runtime = "edge";

export default async function Page() {
  const client = await getClient();
  const res = await client.api.user.currentGroup.$get();
  const body = await res.json();
  const { currentGroup } = body;
  if (currentGroup) {
    redirect(`/group/${currentGroup}/home`);
  }
  const session = await auth();
  if (session?.user?.id) {
    redirect(`/join-group`);
  }
  return <LoginForm />;
}

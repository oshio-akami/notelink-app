import { LoginForm } from "@/components/auth/loginForm/loginForm";
import { redirect } from "next/navigation";
import { getClient } from "@/libs/hono";
import { auth } from "@/auth";

export const runtime = "edge";

export default async function Page() {
  const client = await getClient();
  const res = await client.api.user.groups.$get();
  const body = await res.json();
  const groups = body.groups;
  if (groups && groups?.length > 0) {
    redirect("/home");
  }
  const session = await auth();
  if (session?.user?.id) {
    redirect("/join-group");
  }
  return <LoginForm />;
}

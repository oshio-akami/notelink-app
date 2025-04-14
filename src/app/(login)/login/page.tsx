import { auth } from "@/auth";
import { LoginForm } from "./_components/loginForm/LoginForm";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Page() {
  const session =await auth();
  if(session){
    redirect(`/group/${session.user.currentGroupId}/home`);
  }
  return (
    <div>
      <LoginForm />
    </div>
  );
}

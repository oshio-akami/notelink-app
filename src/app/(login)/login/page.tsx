import { LoginForm } from "./_components/loginForm/LoginForm";
import { redirect } from "next/navigation";
import {getClient} from "@/libs/hono";

export const runtime = "edge";

export default async function Page() {
  const client=await getClient();
  const res=await client.api.user.currentGroup.$get();
  console.log(res);
  const raw=await res.text();
  console.log(raw);
  const body=await res.json();
  const {currentGroup}=body;
  if(currentGroup){   
    redirect(`/group/${currentGroup}/home`);
  }
  return (
    <div>
      <LoginForm />
    </div>
  );
}

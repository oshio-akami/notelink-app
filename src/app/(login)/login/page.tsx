import { auth } from "@/auth";
import { Login } from "@/components/pages/login/Login";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Page() {
  const session =await auth();
  if(session){
    redirect("/dashboard");
  }
  return (
    <div>
      <Login />
    </div>
  );
}

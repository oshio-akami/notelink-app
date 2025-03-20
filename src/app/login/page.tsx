"use client";

import { useSession } from "next-auth/react";
import { Login } from "@/components/pages/login/Login";
import { Logout } from "@/components/pages/logout/Logout";

export default function Page() {
  const { data: session, status } = useSession();
  return (
    <div>
      {status === "authenticated" ? (
        <div>
          <p>セッションの期限：{session.expires}</p>
          <p>ようこそ、{session.user?.name}さん</p>
          <div>
            <Logout />
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

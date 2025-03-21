"use client";

import { useSession } from "next-auth/react";
import { Login } from "@/components/pages/login/Login";
import { Logout } from "@/components/pages/logout/Logout";

export default function Page() {
  const { data: session, status } = useSession();
  return (
    <div>
      <Login />
    </div>
  );
}

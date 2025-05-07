"use server"

import { auth } from "@/auth";
import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signOut as authSignOut} from "@/auth";

export default async function signOut(){
  console.log("signout:");
  const session=await auth();
  if(!session?.user?.id){
    return;
  }
  console.log(session?.user?.id);
  const account=await db.select().from(accounts).where(eq(accounts.userId,session.user.id)).limit(1);
  if(account[0]&&account[0].provider==="credentials"){
    await db.delete(users).where(eq(users.id,session.user.id));
  }

  await authSignOut();
}
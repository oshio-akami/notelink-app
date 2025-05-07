"use server"

import { auth } from "@/auth";
import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signOut as authSignOut} from "@/auth";

/**
 * ユーザーのサインアウト処理を行う関数。
 * 認証情報を確認し、ゲストユーザーの場合アカウントを削除する。
 */
export default async function signOut(){
  const session=await auth();
  if(!session?.user?.id){
    return;
  }
  const account=await db.select().from(accounts).where(eq(accounts.userId,session.user.id)).limit(1);
  if(account[0]&&account[0].provider==="credentials"){
    await db.delete(users).where(eq(users.id,session.user.id));
  }
  await authSignOut();
}
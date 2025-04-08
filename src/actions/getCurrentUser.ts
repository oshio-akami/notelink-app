"use server"

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSession(){
  return await auth();
}

export default async function getCurrentUser(){
  try{
    const session=await getSession()
    if(!session?.user?.id){
      return null
    }
    const currentUser= await db
      .select({users})
      .from(users)
      .where(eq(users.id,session?.user.id))
    if(!currentUser){
      return null;
    }
    return currentUser[0].users;
  }
}
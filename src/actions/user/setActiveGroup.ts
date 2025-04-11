"use server"

import { auth } from "@/auth"
import client from "@/libs/hono"
import { redirect } from "next/navigation";

export default async function setCurrentGroup(groupId:string){
  const session=await auth();
  if(!session?.user?.id){
    return
  }
  await client.api.users.setCurrentGroup.$post({
    json:{
      userId:session.user.id,
      currentGroupId:groupId,
    }
  })
  redirect(`/group/${groupId}/home`);
}
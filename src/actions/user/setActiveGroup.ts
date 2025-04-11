"use server"

import { auth } from "@/auth"
import client from "@/libs/hono"
import { redirect } from "next/navigation";

export default async function setActiveGroup(groupId:string){
  const session=await auth();
  if(!session?.user?.id){
    return
  }
  await client.api.users.setActiveGroup.$post({
    json:{
      userId:session.user.id,
      activeGroupId:groupId,
    }
  })
  redirect(`/group/${groupId}/home`);
}
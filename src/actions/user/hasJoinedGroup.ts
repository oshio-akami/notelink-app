"use server"

import { auth } from "@/auth"
import client from "@/libs/hono"

export default async function hasJoinGroup(groupId:string){
  const session=await auth();
  if(!session?.user?.id){
    console.log("not user");
    return false;
  }
  const res=await client.api.users.hasJoinedGroup.$post({
    json:{
      userId:session.user.id,
      groupId:groupId,
    }
  })
  const body=await res.json();
  return body.hasJoinedGroup;
}
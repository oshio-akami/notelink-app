"use server"

import { auth } from "@/auth"
import client from "@/libs/hono"

export default async function isJoinGroup(groupId:string){
  const session=await auth();
  if(!session?.user?.id){
    return false;
  }
  const res=await client.api.posts.getGroups.$post({
    json:{
      userId:session.user.id,
    }
  })
  const body=await res.json();
  return body.some(c=>c.groupId===groupId);
}
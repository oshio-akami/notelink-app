"use server"

import { auth } from "@/auth"
import client from "@/libs/hono"

export default async function getJoinedGroups(){
  const session=await auth();
  if(!session?.user.id){
    return null;
  }
  const res=await client.api.users.getJoinedGroups.$post({
    json:{
      userId:session?.user.id,
   }
  })
   return await res.json();
}
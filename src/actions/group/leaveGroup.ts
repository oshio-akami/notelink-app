"use server"

import { auth } from "@/auth";
import client from "@/libs/hono";

export default async function leaveGroup(groupId:string){
  const session=await auth();
      if(!session?.user.id){  
        return false;
      }
  const res=await client.api.group.leaveGroup.$post({
    json:{
      userId:session.user.id,
      groupId:groupId,
    }
  });
  const body=await res.json();
  return body.success;
}

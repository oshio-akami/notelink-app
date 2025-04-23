"use server"

import {getClient} from "@/libs/hono";

export default async function leaveGroup(groupId:string){
  const client=await getClient();
  const res=await client.api.user[":groupId"].$delete({
    param:{
      groupId:groupId,
    }
  });
  const body=await res.json();
  if(!body.deleted||body.deleted.length===0){
    return false
  }
  return true;
}

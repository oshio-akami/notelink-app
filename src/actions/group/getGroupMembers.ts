import { auth } from "@/auth";
import client from "@/libs/hono";

export default async function getGroupMembers(groupId:string){
  const session=await auth();
  if(!session?.user.id){  
    return null;
  }    
  const res=await client.api.group.getMembers.$post({
    json:{
      userId:session.user.id,
      groupId:groupId,
    }
  })
  const body=await res.json();
  if(!body.success){
    return null;
  }
  return body.data;
}
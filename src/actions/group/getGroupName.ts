import client from "@/libs/hono";

export default async function getGroupName(groupId:string){
  const res=await client.api.posts.getGroupName.$post({
    json:{
      groupId:groupId,
    }
  });
  const body=await res.json();
  return body.data;
}
import client from "./hono"

export async function hasJoinedGroup(groupId:string){
  const res=await client.api.user.hasJoined[":groupId"].$get({
    param:{
      groupId:groupId,
    }
  })
  const body=await res.json();
  return body.hasJoinedGroup;
}
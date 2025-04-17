import client from "@/libs/hono";

export default async function validateInviteToken(inviteToken:string){
  const res=await client.api.invite.validInviteToken.$post({
    json:{
      inviteToken:inviteToken,
    }
  })
  const body=await res.json();
  console.log(body)
  return body;
}
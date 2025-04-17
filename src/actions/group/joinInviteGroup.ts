"use server"

import client from "@/libs/hono";
import validateInviteToken from "./validateInviteToken";
import { auth } from "@/auth";
import hasJoinGroup from "../user/hasJoinedGroup";
import { redirect } from "next/navigation";

export default async function joinInviteGroup(inviteToken:string){
  const validate=await validateInviteToken(inviteToken);
  if(!validate.success){
    return validate.message;
  }
  const session=await auth();
    if(!session?.user.id){  
      return "ユーザー存在しません";
    }
  if(!validate.message){
    return "招待コードが存在しません";
  }
  const hasJoin=await hasJoinGroup(validate.message);
  if(hasJoin){
    return "すでにグループに参加しています"
  }
  await client.api.posts.joinGroup.$post({
    json:{
      groupId:validate.message,
      userId:session.user.id,
    }
  })
  redirect(`/group/${validate.message}/home`);
}
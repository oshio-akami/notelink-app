"use server"

import { auth } from "@/auth";
import client from "@/libs/hono";
import {parseWithZod} from "@conform-to/zod"
import {createGroupFormSchema} from "@/utils/types/formSchema"
import { redirect } from "next/navigation";

export async function createGroup(_:unknown,formData: FormData){
  const submission=parseWithZod(formData,{schema:createGroupFormSchema});
  if(submission.status!=='success'){
    return submission.reply();
  }
  
  const session=await auth();
  if(!session?.user.id){  
    return submission.reply();
  }
  const res=await client.api.posts.createGroup.$post({
      json:{
        groupName:submission.value.groupName,
      }
  });
  const body=await res.json();
  await client.api.posts.joinGroup.$post({
    json:{
      userId:session?.user.id,
      groupId:body.groupId,
      roleId:1,
    }
  });
  await client.api.users.setCurrentGroup.$post({
    json:{
      userId:session.user.id,
      currentGroupId:body.groupId,
    }
  });
  redirect(`/group/${body.groupId}/home`);
}
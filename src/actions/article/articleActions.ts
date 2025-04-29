"use server"

import { getClient } from "@/libs/hono";
import { PostFormSchema } from "@/utils/types/formSchema"
import { parseWithZod } from "@conform-to/zod"

export async function postArticle(_:unknown,formData:FormData){
  const submission=parseWithZod(formData,{schema:PostFormSchema});
  if(submission.status!=="success"){
    return submission.reply();
  }
  const client=await getClient();
  const {groupId,title,content,image}=submission.value;
  const res=await client.api.article.$post({
    json:{
      groupId:groupId,
      title:title,
      content:content,
      image:image,
    }
  })
  const body= await res.json();
  const created=body.created;
  console.log(created);
  if(!created||created.rowCount===0){
    return {status:"error",message:"投稿に失敗しました"}
  }
  return {status:"success",message:"投稿しました"}
}

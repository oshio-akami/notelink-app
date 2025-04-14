"use server"

import client from "@/libs/hono";
import { auth } from "@/auth";


/**
 * ユーザーがいずれかのグループに参加しているかを取得する関数
 */
export async function hasJoinedGroup(){
  const session = await auth();
  const id=session?.user.id;
  if(!id){
    return false
  }
  const result= await client.api.users.hasJoinedGroup
    .$post({
       json: {
         userId: id,
       },
    });
    const data=await result.json();
    return data.hasJoinedGroup;
};

/**
 * 新規グループを作成する関数
 * @param groupName 作成するグループ名
 */
export async function CreateGroup(data:FormData){
  const groupName=data.get("name");
  if(groupName==""){
    return;
  }
  const test=await client.api.posts.createGroup.$post({
    json:{
      groupName:groupName,
    }
  }); 

  const groupData=await test.json();
  console.log(groupData.groupId);
  await client.api.users.setCurrentGroup.$post({
    json:{
      currentGroupId:groupData.groupId,
    }
  });
}
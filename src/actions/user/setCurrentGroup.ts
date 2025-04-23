"use server"

import {getClient} from "@/libs/hono"
import { redirect } from "next/navigation";

export default async function setCurrentGroup(groupId:string){
  const client=await getClient();
  await client.api.user.currentGroup[":groupId"].$patch({
    param:{
      groupId:groupId,
    }
  })
  redirect(`/group/${groupId}/home`);
}
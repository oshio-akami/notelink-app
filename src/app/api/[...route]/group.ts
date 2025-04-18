
import { Hono } from "hono";
import {db} from "@/db/index";
import { zValidator } from "@hono/zod-validator";
import { getGroupMembersSchema, leaveGroupSchema } from "@/utils/types/apiSchema";
import { groupMembers, roles, userProfiles } from "@/db/schema";
import { eq ,and} from "drizzle-orm";
import client from "@/libs/hono";

export const runtime = "edge";

const group=new Hono()
.post("/getMembers",zValidator("json",getGroupMembersSchema),async(c)=>{
  const body=await c.req.valid("json");
  const {groupId,userId}=body;
  const hasJoined=await client.api.users.hasJoinedGroup.$post({
    json:{userId:userId,groupId:groupId}
  })
  if(!hasJoined){
    return c.json({success:false,data:null});
  }
  const members=await db
    .select({
      userId:groupMembers.userId,
      displayName:userProfiles.displayName,
      image:userProfiles.image,
      role:roles.roleName
    })
    .from(groupMembers)
    .innerJoin(userProfiles,eq(groupMembers.userId,userProfiles.userId))
    .innerJoin(roles,eq(groupMembers.roleId,roles.roleId))
    .where(eq(groupMembers.groupId,groupId))
    .orderBy(groupMembers.roleId);
  return c.json({success:true,data:members});
})
.post("/leaveGroup",zValidator("json",leaveGroupSchema),async(c)=>{
  const body=await c.req.valid("json");
  const {groupId,userId}=body;
  const result=await db
    .delete(groupMembers)
    .where(and(
      eq(groupMembers.userId,userId),
      eq(groupMembers.groupId,groupId),
  )).returning();
  return c.json({success:result.length>0});
});



export default group
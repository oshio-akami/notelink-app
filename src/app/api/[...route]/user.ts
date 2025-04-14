
import { Hono } from "hono";
import {db} from "@/db/index";
import { groupMembers,users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { joinedGroupsSchema,hasJoinedGroupSchema,setCurrentGroupSchema } from "@/utils/types/apiSchema";
import { groups } from "@/db/schema";

export const runtime = "edge";

const user=new Hono()
/**
 * グループに参加しているか
 */
.post("/hasJoinedGroup",zValidator("json",hasJoinedGroupSchema),async (c)=>{
  try{
    const body=c.req.valid("json");
    const {userId}=body;
    console.log("userid : "+userId);
    const result=await db
    .select({groupId:groupMembers.groupId})
    .from(groupMembers)
    .where(eq(groupMembers.userId,userId));
    return c.json({hasJoinedGroup:result.length>0},200);
  }catch(error){
    throw new Error("api error"+error);
  }
})
/**
 * 表示するグループの変更
 */
.post("/setCurrentGroup", zValidator("json",setCurrentGroupSchema),async (c) => {
  const body=c.req.valid("json");
  const {currentGroupId,userId}=body;
  if(!currentGroupId||!userId){
    return;
  }
  const result=await db
    .update(users)
    .set({currentGroupId:currentGroupId})
    .where(eq(users.id,userId));
  return c.json(result);
  /**
 * 参加しているグループ一覧
 */
}).post("/getJoinedGroups",zValidator("json",joinedGroupsSchema),async(c)=>{
   const body=await c.req.valid("json");
    const {userId}=body;
    const result = await db
     .select({
       groupId: groups.groupId,
       groupName: groups.groupName,
     })
     .from(groupMembers)
     .innerJoin(groups, eq(groupMembers.groupId, groups.groupId))
     .where(eq(groupMembers.userId, userId));
    return c.json(result);
})


export default user
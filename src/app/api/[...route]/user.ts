
import { Hono } from "hono";
import {db} from "@/db/index";
import { groupMembers,users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { joinGroupSchema } from "@/utils/types/apiSchema";

export const runtime = "edge";

const setCurrentGroupSchema = z.object({
  currentGroupId: z.string(),
  userId:z.string(),
});

const hasJoinedSchema=z.object({
  userId:z.string(),
})




const user=new Hono()
.post("/hasJoined",zValidator("json",hasJoinedSchema),async (c)=>{
  try{
    const body=c.req.valid("json");
    const {userId}=body;
    console.log("userid : "+userId);
    const result=await db
    .select({groupId:groupMembers.groupId})
    .from(groupMembers)
    .where(eq(groupMembers.userId,userId));
    return c.json({hasJoined:result.length>0},200);
  }catch(error){
    throw new Error("api error"+error);
  }
  
})
.get("/", async (c) => {
  return c.json({ testSub: "Root!" });
})
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
}).post("/getJoinGroups",zValidator("json",joinGroupSchema),async(c)=>{
  const body=c.req.valid("json");
})


export default user
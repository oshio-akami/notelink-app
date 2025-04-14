
import { Hono } from "hono";
import {db} from "@/db/index";
import { groups, users,groupMembers } from "@/db/schema";
export const runtime = "edge";
import client from "@/libs/hono";
import { auth } from "@/auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getGroupNameSchema } from "@/utils/types/apiSchema";

interface joinGroupRequestBody{
  groupId:string;
  userId:string;
}

const createGroupSchema = z.object({
  groupName: z.string(),
});

async function getUserId(){
  const session =await auth();
  const userId=session?.user?.id;
  return userId;
}

const posts=new Hono()
.get("/", async (c) => {
  return c.json({ test: "Root!" });
})
.get("/name", async (c) => {
  const result=await db.select({name:users.name}).from(users).execute(); 
  return c.json(result);
})
.post("/createGroup",
  zValidator("json",createGroupSchema,),async(c)=>{
    const body=await c.req.valid("json");
    const name=body.groupName;
    const insertGroup=await db.insert(groups).values({
      groupName:name,
    })
    .returning();
    const userId=await getUserId();
    await client.api.posts.joinGroup.$post({
      json:{
        groupId:insertGroup[0].groupId,
        userId:userId,
      }
    });
    return c.json(insertGroup[0]);
})
.post("/joinGroup",async (c) => {
  const body=await c.req.json<joinGroupRequestBody>();
    const groupId=body.groupId;
    const userId=body.userId;
    if(!userId||!groupId){
      return c.json({error:"ユーザーID、グループIDが存在しません"},400);
    }
    await db.insert(groupMembers).values({
      userId:userId,
      groupId:groupId,
    });
    return c.json({message:"グループを作成しました"});
}).post("/getGroupName", zValidator("json",getGroupNameSchema),async(c)=>{
  const body=await c.req.valid("json");
  if(!body||!body.groupId){
    console.log("error-throw")
    throw new Error('Validation failed: groupId is required');
  }
    const groupId=body.groupId;
    const result=await db
    .select({groupName:groups.groupName})
    .from(groups)
    .where(eq(groups.groupId,groupId))
    return c.json({success:true,data:result});
});


export default posts
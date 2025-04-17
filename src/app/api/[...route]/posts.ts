
import { Hono } from "hono";
import {db} from "@/db/index";
import { groups, users,groupMembers, groupInvites } from "@/db/schema";
export const runtime = "edge";
import client from "@/libs/hono";
import { auth } from "@/auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getGroupNameSchema, inviteSchema, joinGroupSchema, joinInviteGroupSchema } from "@/utils/types/apiSchema";


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
.post("/joinGroup",
  zValidator("json",joinGroupSchema), async (c) => {
    const body=await c.req.valid("json");
    const {groupId,userId,roleId}=body;
    if(!userId||!groupId){
      return c.json({error:"ユーザーID、グループIDが存在しません"},400);
    }
    await db.insert(groupMembers).values({
      userId:userId,
      groupId:groupId,
      roleId:roleId,
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
    .limit(1);
    return c.json({success:true,data:result[0]});
}).post("/createInviteToken",zValidator("json",inviteSchema),async(c)=>{
  const body=await c.req.valid("json");
  const {groupId}=body;
  const result=await db
  .insert(groupInvites).values({
    groupId:groupId,
  })
  .returning();
  return c.json(result);
}).post("/getInviteToken",zValidator("json",inviteSchema),async(c)=>{
  const body=await c.req.valid("json");
  const {groupId}=body;
  const inviteData=await db
  .select({groupInvites})
  .from(groupInvites)
  .where(eq(groupInvites.groupId,groupId))
  .orderBy(groupInvites.createdAt)
  .limit(1);
  if(!inviteData[0]){
    return c.json({success:false,data:null});
  }
  const {token,expiresAt}=inviteData[0].groupInvites;
  const currentDate=new Date();
  if(!token){
    return c.json({success:false,data:null});
  }
  if(expiresAt<currentDate){
    return c.json({success:false,data:null});
  }
  return c.json({success:true,data:token});
});


export default posts

import { Hono } from "hono";
import {db} from "@/db/index";
import { groupInvites } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { inviteSchema,validInviteTokenSchema } from "@/utils/types/apiSchema";


export const runtime = "edge";

const invite=new Hono()
.post("/validInviteToken",zValidator("json",validInviteTokenSchema,(result,c)=>{
  if(!result.success){
    return c.json({success:false,message:"招待コードが存在しません"});
  }
}),async(c)=>{
  const body=await c.req.valid("json");
    const {inviteToken}=body;
    const result=await db
    .select({groupInvites})
    .from(groupInvites)
    .where(eq(groupInvites.token,inviteToken))
    .limit(1);
    if(!result[0]){
      return c.json({success:false,message:"グループが存在しません"});
    }
    const {expiresAt}=result[0].groupInvites;
    const currentDate=new Date();
    if(expiresAt<currentDate){
      return c.json({success:false,message:"招待期限が切れています"});
    }
    return c.json({success:true,message:result[0].groupInvites.groupId});
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


export default invite
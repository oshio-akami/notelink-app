
import { Hono } from "hono"
import {db} from "@/db/index"
import { groupInvites } from "@/db/schema"
import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { hasJoinedGroup } from "@/libs/apiLibs"
import { handleApiError } from "@/libs/handleApiError"


export const runtime = "edge"

const invite=new Hono()
.get("/validate/:token",zValidator("param",z.object({
  token:z.string().uuid(),
})),async(c)=>{
  try{
    const {token}=await c.req.valid("param")
    const result=await db
    .select({groupInvites})
    .from(groupInvites)
    .where(eq(groupInvites.token,token))
    .limit(1)
    if(!result[0]){
      return c.json({success:false},404)
    }
    const {expiresAt}=result[0].groupInvites
    const currentDate=new Date()
    if(expiresAt<currentDate){
      return c.json({success:false},410)
    }
    return c.json({success:true,message:result[0].groupInvites.groupId})
  }catch(error){
    return handleApiError(c,error,{success:false})
  }
})
/**招待トークンを作成するAPI */
.post("/token/:groupId",zValidator("param",z.object({
  groupId:z.string().uuid(),
})),async(c)=>{
  try{
    const {groupId}=await c.req.valid("param")
    const hasJoined=await hasJoinedGroup(groupId)
    if(!hasJoined){
      return c.json({token:null},403)
    }
    const created=await db
      .insert(groupInvites).values({
        groupId:groupId,
    })
    .returning()
    if(!created[0]){
      return c.json({token:null},404)
    }
    return c.json({token:created[0].token},200)
  }catch(error){
    return handleApiError(c,error,{token:null})
  }
}).get("/token/:groupId",zValidator("param",z.object({
  groupId:z.string().uuid(),
})),async(c)=>{
  try{
    const {groupId}=await c.req.valid("param")
    const hasJoined=await hasJoinedGroup(groupId)
    if(!hasJoined){
      return c.json({token:null},403)
    }
    const inviteData=await db
      .select({groupInvites})
      .from(groupInvites)
      .where(eq(groupInvites.groupId,groupId))
      .orderBy(groupInvites.createdAt)
      .limit(1)
    if(!inviteData[0]){
      return c.json({token:null},404)
    }
    const {token,expiresAt}=inviteData[0].groupInvites
    const currentDate=new Date()
    if(!token){
      return c.json({token:null},404)
    }
    if(expiresAt<currentDate){
      return c.json({token:null},410)
    }
    return c.json({token:token})
  }
  catch(error){
    return handleApiError(c,error,{token:null})
  }
})


export default invite
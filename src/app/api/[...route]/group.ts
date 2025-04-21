
import { Hono } from "hono"
import {db} from "@/db/index"
import { zValidator } from "@hono/zod-validator"
import { groupMembers, roles, userProfiles ,groups} from "@/db/schema"
import { eq } from "drizzle-orm"
import client from "@/libs/hono"
import { z } from "zod"
import { auth } from "@/auth"
import { handleApiError } from "@/libs/handleApiError"
import { hasJoinedGroup } from "@/libs/apiLibs"

export const runtime = "edge"

const group=new Hono()
/**グループのメンバー一覧を取得するAPI */
.get("/members/:groupId",zValidator("param",z.object({
  groupId:z.string().uuid(),
})),async(c)=>{
  try{
    const  {groupId}=await c.req.valid("param")
    const hasJoined=await client.api.user.hasJoined[":groupId"].$get({
      param:{groupId:groupId}
    })
    if(!hasJoined){
      return c.json({members:null},403)
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
      .orderBy(groupMembers.roleId)
    return c.json({members:members},200)
  }catch(error){
    return handleApiError(c,error,{members:null})
  }
})
/**グループを作成するAPI */
.post("/create",zValidator("json",z.object({
    groupName:z.string().uuid(),
  })),async(c)=>{
    try{
      
      const body=await c.req.valid("json")
      const name=body.groupName
      const createdGroup=await db.insert(groups).values({
      groupName:name,
      })
      .returning()
      if(createdGroup.length===0){
        return c.json({success: false }, 404)
      }
      const session=await auth()
      if(!session?.user.id){
        return c.json({created:null},401)
      }
      const userId=session.user.id
      await db.insert(groupMembers).values({
        userId:userId,
        groupId:createdGroup[0].groupId,
        roleId:1,
      }).returning()
      return c.json({created:createdGroup[0]},200)
    }catch(error){
      return handleApiError(c,error,{created:null})
    }
})
/**グループの情報を取得するAPI */
.get("/:groupId",zValidator("param",z.object({
  groupId:z.string().uuid(),
})),async(c)=>{
    try{
      const {groupId}=c.req.valid("param")
      const hasJoined=await hasJoinedGroup(groupId)
      if(!hasJoined){
        return c.json({group:null},403)
      }
      const group=await db
        .select()
        .from(groups)
        .where(eq(groups.groupId,groupId))
        .limit(1)
      if(group.length===0){
        return c.json({ group: null }, 404)
      }
      return c.json({ group: group[0] }, 404)
    }catch(error){
      return handleApiError(c,error,{group:null})
    }
  }
)


export default group
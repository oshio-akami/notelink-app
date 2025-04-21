import { Hono } from "hono"
import {db} from "@/db/index"
import { groupMembers,users } from "@/db/schema"
import { eq,and } from "drizzle-orm"
import { zValidator } from "@hono/zod-validator"
import { auth } from "@/auth"
import { groups } from "@/db/schema"
import { z } from "zod"

export const runtime = "edge"

const user = new Hono()
  /**グループに参加しているか確認するAPI */
  .get("/hasJoined/:groupId",
    zValidator("param", z.object({
      groupId:z.string().uuid(),
    })),
    async (c) => {
      try {
        const session=await auth()
        if(!session?.user.id){
          return c.json({hasJoinedGroup:false},401)
        }
        const userId=session.user.id
        const {groupId} = c.req.valid("param")
        const result = await db
          .select()
          .from(groupMembers)
          .where(
            and(
              eq(groupMembers.userId, userId),
              eq(groupMembers.groupId, groupId)
            )
          )
          .limit(1)
        return c.json({ hasJoinedGroup: result.length > 0 }, 200)
      } catch (error) {
        if(error instanceof z.ZodError){
          return c.json({hasJoinedGroup:false},422)
        }
        return c.json({hasJoinedGroup:false},500)
      }
    }
  )
  /**グループに参加するAPI */
  .post("/join/:groupId",
    zValidator("json",z.object({
      roleId:z.number().default(2),
    })),
    zValidator("param",z.object({
      groupId:z.string().uuid(),
    })),
    async (c)=>{
      try{
        const session=await auth()
        if(!session?.user.id){
          return c.json({success:false},401)
        }
        const userId=session.user.id
        const {groupId} = c.req.valid("param")
        const {roleId}=c.req.valid("json")
        const joinedGroup=await db.insert(groupMembers).values({
          userId:userId,
          groupId:groupId,
          roleId:roleId,
        }).returning()
        if(joinedGroup.length===0){
          return c.json({joinedGroup:null},500)
        }
        return c.json({joinedGroup:joinedGroup},200)
      }catch(error){
        if(error instanceof z.ZodError){
          return c.json({joinedGroup:null},422)
        }
        return c.json({joinedGroup:null},500)
      }
  })
  /**現在のグループを更新するAPI */
  .patch("/currentGroup/:groupId",zValidator("param", z.object({
    currentGroupId:z.string().uuid(),
  })),
    async (c) => {
      try{
        const session=await auth()
        if(!session?.user.id){
          return c.json({success:false},401)
        }
        const userId=session.user.id
        const body = c.req.valid("param")
        const { currentGroupId } = body
        if (!currentGroupId || !userId) {
          return
        }
        const setCurrentGroup = await db
          .update(users)
          .set({ currentGroupId: currentGroupId })
          .where(eq(users.id, userId))
        if(setCurrentGroup.rowCount===0){
          return c.json({success: false }, 404)
        }
        return c.json({success:true},200)
      }catch(error){
        if(error instanceof z.ZodError){
          return c.json({success:false},422)
        }
        return c.json({success:false},500)
      }
    }
  )
  /**グループ一覧を取得するAPI */
  .get("/groups",
    async (c) => {
      const session=await auth()
      if(!session?.user.id){
        return c.json({hasJoined:false},401)
      }
      const userId=session.user.id
      const groupList = await db
        .select({
          groupId: groups.groupId,
          groupName: groups.groupName,
        })
        .from(groupMembers)
        .innerJoin(groups, eq(groupMembers.groupId, groups.groupId))
        .where(eq(groupMembers.userId, userId))
      return c.json({groups:groupList},200)
    }
  )
  /**グループを退会するAPI */
  .delete("/:groupId",zValidator("param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const session=await auth()
        if(!session?.user.id){
          return c.json({hasJoined:false},401)
        }
        const body = await c.req.valid("param")
        const {groupId } = body
        const userId=session.user.id
        const deleted = await db
          .delete(groupMembers)
          .where(
            and(
              eq(groupMembers.userId, userId),
              eq(groupMembers.groupId, groupId)
            )
          ).returning()
        if (deleted.length === 0) {
          return c.json({ deleted: null }, 404)
        }
        return c.json({ deleted: deleted }, 200)
      } catch (error) {
        if(error instanceof z.ZodError){
          return c.json({deleted: null },422)
        }
        return c.json({deleted: null },500)
      }
    }
  )


export default user
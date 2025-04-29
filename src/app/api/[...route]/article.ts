import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod" 
import { handleApiError } from "@/libs/handleApiError"
import { db } from "@/db"
import { articles } from "@/db/schema"
import { hasJoinedGroup } from "@/libs/apiLibs"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"

export const runtime = "edge"


const article=new Hono()
.get("/:groupId/articles",zValidator("param",z.object({
  groupId:z.string().uuid(),
})),async(c)=>{
  try{
    const {groupId}=await c.req.valid("param")
    const hasJoined=await hasJoinedGroup(groupId)
    if(!hasJoined){
      return c.json({articles:null},404)
    }
    const articleList=await db
      .select({
        title:articles.title,
        content:articles.content,
        image:articles.image,
        createdAt:articles.createdAt,
      })
      .from(articles)
      .where(eq(articles.groupId,groupId))
    return c.json({articles:articleList},200)
  }catch(error){
    return handleApiError(c,error,{article:false})
  }
})
.post("/",zValidator("json",z.object({
  groupId:z.string().uuid(),
  title:z.string(),
  content:z.string().default(""),
  image:z.string().default(""),
})),async(c)=>{
  try{
    const session=await auth();
    if(!session?.user?.id){
      return c.json({created:null},401)
    }
    const {groupId,title,image,content}=c.req.valid("json")
    const created=await db
      .insert(articles).values({
        groupId:groupId,
        userId:session.user.id,
        title:title,
        content:content,
        image:image,
    })
    return c.json({created:created},200)
  }catch(error){
    return handleApiError(c,error,{article:false})
  }
})

export default article
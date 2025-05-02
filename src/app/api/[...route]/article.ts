import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod" 
import { handleApiError } from "@/libs/handleApiError"
import { db } from "@/db"
import { articles, userProfiles } from "@/db/schema"
import { hasJoinedGroup } from "@/libs/apiLibs"
import { eq ,desc,and} from "drizzle-orm"
import { auth } from "@/auth"

export const runtime = "edge"


const article=new Hono()
.get("/:groupId/articles/:mine?",zValidator("param",z.object({
  groupId:z.string().uuid(),
  mine:z.string().optional().transform((val)=>val==="true").default("false")
})),async(c)=>{
  try{
    const {groupId,mine}=await c.req.valid("param")
    const hasJoined=await hasJoinedGroup(groupId)
    if(!hasJoined){
      return c.json({articles:null},404)
    }
    const session=await auth();
    if(!session?.user?.id){
      return c.json({articles:null},401)
    }
    const whereConditions = [eq(articles.groupId, groupId)];
    if (mine) {
     whereConditions.push(eq(articles.userId, session?.user?.id));
    }
    const articleList=await db
      .select({
        userProfiles:{
          userId:userProfiles.userId,
          displayName:userProfiles.displayName,
          image:userProfiles.image,
        },
        title:articles.title,
        content:articles.content,
        image:articles.image,
        createdAt:articles.createdAt,
      })
      .from(articles)
      .innerJoin(userProfiles,eq(articles.userId,userProfiles.userId))
      .where(and(...whereConditions))
      .orderBy(desc(articles.createdAt))
    return c.json({articles:articleList},200)
  }catch(error){
    return handleApiError(c,error,{articles:false})
  }
})
.get("/:groupId/bookmarks",zValidator("param",z.object({
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
        userProfiles:{
          userId:userProfiles.userId,
          displayName:userProfiles.displayName,
          image:userProfiles.image,
        },
        id:articles.id,
        title:articles.title,
        content:articles.content,
        image:articles.image,
        createdAt:articles.createdAt,
      })
      .from(articles)
      .innerJoin(userProfiles,eq(articles.userId,userProfiles.userId))
      .where(eq(articles.groupId,groupId))
      .orderBy(desc(articles.createdAt))
      return c.json({articles:articleList},200)
  }catch(error){
    return handleApiError(c,error,{articles:false})
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
.delete("/:articleId",zValidator("param",z.object({
  articleId:z.string().uuid(),
})),async(c)=>{
  try{
    const session=await auth();
    if(!session?.user?.id){
      return c.json({deleted:null},401)
    }
    const {articleId}=c.req.valid("param")
    const deleted=await db
      .delete(articles)
      .where(eq(articles.id,articleId))
    return c.json({deleted:deleted},200)
  }catch(error){
    return handleApiError(c,error,{article:false})
  }
})

export default article
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { handleApiError } from "@/libs/handleApiError";
import { db } from "@/db";
import { articles, bookmarks, groupMembers, userProfiles } from "@/db/schema";
import { hasJoinedGroup, withGroupMemberCheck } from "@/libs/apiUtils";
import { eq, desc, and, or, exists } from "drizzle-orm";
import { getSessionUserId } from "@/libs/getSessionUserId";

export const runtime = "edge";

const admin = 1;

const article = new Hono()
  .get(
    "/:groupId/articles/:mine?",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
        mine: z
          .string()
          .optional()
          .transform((val) => val === "true")
          .default("false"),
      })
    ),
    async (c) => {
      try {
        const { groupId, mine } = await c.req.valid("param");
        const hasJoined = await hasJoinedGroup(groupId);
        if (!hasJoined) {
          return c.json({ articles: null }, 404);
        }
        const userId = await getSessionUserId();
        if (!userId) {
          return c.json({ articles: null }, 401);
        }
        const whereConditions = [eq(articles.groupId, groupId)];
        if (mine) {
          whereConditions.push(eq(articles.userId, userId));
        }
        const articleList = await db
          .select({
            userProfiles: {
              userId: userProfiles.userId,
              displayName: userProfiles.displayName,
              image: userProfiles.image,
            },
            id: articles.id,
            title: articles.title,
            content: articles.content,
            image: articles.image,
            createdAt: articles.createdAt,
            isBookmark: bookmarks.articleId,
          })
          .from(articles)
          .innerJoin(userProfiles, eq(articles.userId, userProfiles.userId))
          .leftJoin(
            bookmarks,
            and(
              eq(articles.id, bookmarks.articleId),
              eq(bookmarks.userId, userId)
            )
          )
          .where(and(...whereConditions))
          .orderBy(desc(articles.createdAt));
        const replaceArticleList = articleList.map((article) => ({
          ...article,
          isBookmark: article.isBookmark != null,
        }));
        return c.json({ articles: replaceArticleList }, 200);
      } catch (error) {
        return handleApiError(c, error, { articles: false });
      }
    }
  )
  .post(
    "/bookmark/:articleId",
    zValidator(
      "param",
      z.object({
        articleId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { articleId } = await c.req.valid("param");
        const userId = await getSessionUserId();
        if (!userId) {
          return c.json({ success: false }, 403);
        }
        const bookmark = await db
          .insert(bookmarks)
          .values({
            userId: userId,
            articleId: articleId,
          })
          .returning();
        if (bookmark.length === 0) {
          return c.json({ success: false });
        }
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { success: false });
      }
    }
  )
  .delete(
    "/bookmark/:articleId",
    zValidator(
      "param",
      z.object({
        articleId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { articleId } = await c.req.valid("param");
        const userId = await getSessionUserId();
        if (!userId) {
          return c.json({ success: false }, 403);
        }
        const deleted = await db
          .delete(bookmarks)
          .where(
            and(
              eq(bookmarks.userId, userId),
              eq(bookmarks.articleId, articleId)
            )
          )
          .execute();
        if (deleted.rowCount === 0) {
          return c.json({ success: false }, 404);
        }
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { success: false });
      }
    }
  )
  .get(
    "/:groupId/bookmarks",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId } = await c.req.valid("param");
        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ bookmarkList: null }, check.status);
        }
        const bookmarkList = await db
          .select({
            userId: bookmarks.userId,
            articleId: bookmarks.articleId,
          })
          .from(bookmarks)
          .where(and(eq(bookmarks.userId, check.userId)))
          .orderBy(desc(bookmarks.createdAt));
        return c.json({ bookmarkList: bookmarkList }, 200);
      } catch (error) {
        return handleApiError(c, error, { bookmarkList: null });
      }
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        groupId: z.string().uuid(),
        title: z.string(),
        content: z.string().default(""),
        image: z.string().default(""),
      })
    ),
    async (c) => {
      try {
        const { groupId, title, image, content } = c.req.valid("json");
        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ created: null }, check.status);
        }
        const created = await db.insert(articles).values({
          groupId: groupId,
          userId: check.userId,
          title: title,
          content: content,
          image: image,
        });
        return c.json({ created: created }, 200);
      } catch (error) {
        return handleApiError(c, error, { article: false });
      }
    }
  )
  .get(
    "/:groupId/:articleId",
    zValidator(
      "param",
      z.object({
        articleId: z.string().uuid(),
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { articleId, groupId } = c.req.valid("param");

        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ article: null }, check.status);
        }

        const article = await db
          .select({
            userProfiles: {
              userId: userProfiles.userId,
              displayName: userProfiles.displayName,
              image: userProfiles.image,
            },
            id: articles.id,
            title: articles.title,
            content: articles.content,
            image: articles.image,
            createdAt: articles.createdAt,
            isBookmark: bookmarks.articleId,
          })
          .from(articles)
          .where(and(eq(articles.id, articleId), eq(articles.groupId, groupId)))
          .innerJoin(userProfiles, eq(articles.userId, userProfiles.userId))
          .leftJoin(
            bookmarks,
            and(
              eq(articles.id, bookmarks.articleId),
              eq(bookmarks.userId, check.userId)
            )
          )
          .limit(1);
        if (article.length <= 0) {
          return c.json({ article: null }, 404);
        }
        const replaceArticle = {
          ...article[0],
          isBookmark: article[0].isBookmark != null,
        };
        return c.json({ article: replaceArticle }, 200);
      } catch (error) {
        return handleApiError(c, error, { article: null });
      }
    }
  )
  .delete(
    "/:articleId",
    zValidator(
      "param",
      z.object({
        articleId: z.string().uuid(),
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { articleId, groupId } = c.req.valid("param");
        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ article: null }, check.status);
        }
        //投稿者本人か管理者の場合削除
        const deleted = await db.delete(articles).where(
          and(
            eq(articles.id, articleId),
            or(
              eq(articles.userId, check.userId),
              exists(
                db
                  .select()
                  .from(groupMembers)
                  .where(
                    and(
                      eq(groupMembers.userId, check.userId),
                      eq(groupMembers.groupId, articles.groupId),
                      eq(groupMembers.roleId, admin)
                    )
                  )
              )
            )
          )
        );
        return c.json({ deleted: deleted }, 200);
      } catch (error) {
        return handleApiError(c, error, { article: false });
      }
    }
  );

export default article;

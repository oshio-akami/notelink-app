import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { handleApiError } from "@/libs/handleApiError";
import { db } from "@/db";
import {
  articles,
  bookmarks,
  comments,
  groupMembers,
  userProfiles,
} from "@/db/schema";
import { hasJoinedGroup, withGroupMemberCheck } from "@/libs/apiUtils";
import { eq, desc, and, or, exists, sql } from "drizzle-orm";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { ROLE_ADMIN } from "@/libs/roleUtils";

export const runtime = "edge";

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
            commentCount: sql<number>`COUNT(comments.id)`,
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
          .leftJoin(comments, eq(articles.id, comments.articleId))
          .where(and(...whereConditions))
          .groupBy(
            articles.id,
            userProfiles.userId,
            userProfiles.displayName,
            userProfiles.image,
            articles.title,
            articles.content,
            articles.image,
            articles.createdAt,
            bookmarks.articleId
          )
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
  /**ブックマークの追加 */
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
  /**ブックマークの削除 */
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
  /**ブックマーク一覧の取得 */
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
  /**投稿の取得 */
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
            commentCount: sql<number>`COUNT(comments.id)`,
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
          .leftJoin(comments, eq(articles.id, comments.articleId))
          .groupBy(
            articles.id,
            userProfiles.userId,
            userProfiles.displayName,
            userProfiles.image,
            articles.title,
            articles.content,
            articles.image,
            articles.createdAt,
            bookmarks.articleId
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
  /**投稿の削除 */
  .delete(
    "/:groupId/:articleId",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
        articleId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId, articleId } = c.req.valid("param");
        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ success: false }, check.status);
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
                      eq(groupMembers.groupId, groupId),
                      eq(groupMembers.roleId, ROLE_ADMIN)
                    )
                  )
              )
            )
          )
        );
        const success = deleted.rowCount > 0;
        if (!success) {
          return c.json({ success: false }, 404);
        }
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { success: false });
      }
    }
  )
  /**コメントの一覧を取得するAPI */
  .get(
    "/comments/:groupId/:articleId",
    zValidator(
      "param",
      z.object({
        articleId: z.string().uuid(),
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId, articleId } = await c.req.valid("param");
        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ comments: null }, check.status);
        }
        const commentList = await db
          .select({
            userProfiles: {
              userId: userProfiles.userId,
              displayName: userProfiles.displayName,
              image: userProfiles.image,
            },
            id: comments.id,
            articleId: comments.articleId,
            groupId: comments.groupId,
            userId: comments.userId,
            createdAt: comments.createdAt,
            content: comments.comment,
          })
          .from(comments)
          .innerJoin(userProfiles, eq(comments.userId, userProfiles.userId))
          .where(
            and(
              eq(comments.articleId, articleId),
              eq(comments.groupId, groupId)
            )
          )
          .orderBy(desc(comments.createdAt));
        return c.json({ comments: commentList }, 200);
      } catch (error) {
        return handleApiError(c, error, { comments: null });
      }
    }
  )
  /**コメントを送信するAPI */
  .post(
    "/comment/:groupId/:articleId",
    zValidator(
      "param",
      z.object({
        articleId: z.string().uuid(),
        groupId: z.string().uuid(),
      })
    ),
    zValidator(
      "json",
      z.object({
        comment: z.string(),
      })
    ),
    async (c) => {
      try {
        const { comment } = await c.req.valid("json");
        const { groupId, articleId } = await c.req.valid("param");
        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ success: false }, check.status);
        }
        const post = await db
          .insert(comments)
          .values({
            userId: check.userId,
            articleId: articleId,
            groupId: groupId,
            comment: comment,
          })
          .execute();
        if (post.rowCount === 0) {
          return c.json({ success: false }, 500);
        }
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { article: false });
      }
    }
  )
  /**コメントを削除するAPI */
  .delete(
    "/comment/:groupId/:commentId",
    zValidator(
      "param",
      z.object({
        commentId: z.string().uuid(),
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId, commentId } = await c.req.valid("param");
        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ success: false }, check.status);
        }
        const deleted = await db
          .delete(comments)
          .where(eq(comments.id, commentId))
          .execute();
        if (deleted.rowCount === 0) {
          return c.json({ success: false }, 404);
        }
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { article: false });
      }
    }
  );

export default article;

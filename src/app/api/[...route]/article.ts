import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { handleApiError } from "@/libs/handleApiError";
import {
  addBookmarkService,
  deleteArticleService,
  deleteBookmarkService,
  deleteCommentService,
  getArticleService,
  getArticlesService,
  getBookmarksService,
  getCommentsService,
  insertArticleService,
  postCommentService,
} from "@/services/article/article";

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
        const result = await getArticlesService(groupId, mine);
        return c.json({ articles: result.articles }, 200);
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
        await addBookmarkService(articleId);
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
        await deleteBookmarkService(articleId);
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
        const result = await getBookmarksService(groupId);
        return c.json({ bookmarkList: result.bookmarks }, 200);
      } catch (error) {
        return handleApiError(c, error, { bookmarkList: null });
      }
    }
  )
  /**記事の投稿 */
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
        const result = await insertArticleService(
          groupId,
          title,
          image,
          content
        );
        return c.json({ created: result.postedArticle }, 200);
      } catch (error) {
        return handleApiError(c, error, { created: false });
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
        const { articleId, groupId } = await c.req.valid("param");
        const result = await getArticleService(groupId, articleId);
        return c.json({ article: result.article }, 200);
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
        const { groupId, articleId } = await c.req.valid("param");
        await deleteArticleService(groupId, articleId);
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
        const result = await getCommentsService(groupId, articleId);
        return c.json({ comments: result.comments }, 200);
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
        await postCommentService(groupId, articleId, comment);
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
        await deleteCommentService(groupId, commentId);
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { article: false });
      }
    }
  );

export default article;

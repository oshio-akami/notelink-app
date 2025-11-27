import { db } from "@/db";
import {
  articles,
  bookmarks,
  comments,
  groupMembers,
  userProfiles,
} from "@/db/schema";
import { ROLE_ADMIN } from "@/libs/roleUtils";
import { eq, desc, and, or, exists, sql, SQL } from "drizzle-orm";

/**グループ内の記事一覧の取得 */
export async function findGroupArticlesQuery(
  userId: string,
  whereConditions: SQL<unknown>[]
) {
  const result = await db
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
      and(eq(articles.id, bookmarks.articleId), eq(bookmarks.userId, userId))
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
  return result;
}

/**ブックマークを挿入 */
export async function insertBookmarkQuery(userId: string, articleId: string) {
  return await db
    .insert(bookmarks)
    .values({
      userId: userId,
      articleId: articleId,
    })
    .returning();
}

/**ブックマークの削除 */
export async function deleteBookmarkQuery(userId: string, articleId: string) {
  return await db
    .delete(bookmarks)
    .where(
      and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId))
    )
    .returning();
}

/**ユーザーのブックマーク一覧を取得 */
export async function findBookmarksQuery(userId: string) {
  return await db
    .select({
      userId: bookmarks.userId,
      articleId: bookmarks.articleId,
    })
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId)))
    .orderBy(desc(bookmarks.createdAt));
}

/**記事を挿入 */
export async function insertArticleQuery(
  userId: string,
  groupId: string,
  title: string,
  content: string,
  image: string
) {
  return await db
    .insert(articles)
    .values({
      groupId: groupId,
      userId: userId,
      title: title,
      content: content,
      image: image,
    })
    .returning();
}

/**記事の詳細の取得 */
export async function findArticleQuery(
  userId: string,
  groupId: string,
  articleId: string
) {
  return await db
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
      and(eq(articles.id, bookmarks.articleId), eq(bookmarks.userId, userId))
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
}

/**記事を削除 */
export async function deleteArticleQuery(
  userId: string,
  groupId: string,
  articleId: string
) {
  return await db
    .delete(articles)
    .where(
      and(
        eq(articles.id, articleId),
        or(
          eq(articles.userId, userId),
          exists(
            db
              .select()
              .from(groupMembers)
              .where(
                and(
                  eq(groupMembers.userId, userId),
                  eq(groupMembers.groupId, groupId),
                  eq(groupMembers.roleId, ROLE_ADMIN)
                )
              )
          )
        )
      )
    )
    .returning();
}

/**コメントの詳細を取得 */
export async function findCommentsQuery(groupId: string, articleId: string) {
  return await db
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
      and(eq(comments.articleId, articleId), eq(comments.groupId, groupId))
    )
    .orderBy(desc(comments.createdAt));
}

/**コメントを挿入 */
export async function insertCommentQuery(
  userId: string,
  groupId: string,
  articleId: string,
  comment: string
) {
  return await db
    .insert(comments)
    .values({
      userId: userId,
      articleId: articleId,
      groupId: groupId,
      comment: comment,
    })
    .returning();
}

/**コメントを削除 */
export async function deleteCommentQuery(commentId: string) {
  return await db
    .delete(comments)
    .where(eq(comments.id, commentId))
    .returning();
}

import {
  deleteArticleQuery,
  deleteBookmarkQuery,
  deleteCommentQuery,
  findArticleQuery,
  findBookmarksQuery,
  findCommentsQuery,
  findGroupArticlesQuery,
  insertArticleQuery,
  insertBookmarkQuery,
  insertCommentQuery,
} from "@/db/queries/article";
import { withGroupMemberCheck } from "../withGroupMemberCheck";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { articleWhere } from "@/services/article/articleWhere";
import { normalizeArticles } from "@/services/article/normalizeArticles";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";

/**指定したグループの記事一覧を取得する */
export async function getArticlesService(groupId: string, mine: boolean) {
  const check = await withGroupMemberCheck(groupId);
  const whereConditions = articleWhere(check.userId, groupId, mine);
  const result = await findGroupArticlesQuery(check.userId, whereConditions);
  const normalizedArticles = normalizeArticles(result);
  return { articles: normalizedArticles };
}

/**ブックマークを追加する */
export async function addBookmarkService(articleId: string) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  const addBookmark = await insertBookmarkQuery(userId, articleId);
  if (addBookmark.length === 0) {
    throw new Error();
  }
  return { addBookmark: addBookmark };
}

/**ブックマークを削除する */
export async function deleteBookmarkService(articleId: string) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  const deleted = await deleteBookmarkQuery(userId, articleId);
  if (deleted.length === 0) {
    throw new NotFoundError();
  }
  return { deleteBookmark: deleted };
}

/**ブックマーク一覧を取得する */
export async function getBookmarksService(groupId: string) {
  const check = await withGroupMemberCheck(groupId);
  const bookmarks = await findBookmarksQuery(check.userId);
  return { bookmarks: bookmarks };
}

/**記事を投稿する */
export async function insertArticleService(
  groupId: string,
  title: string,
  image: string,
  content: string
) {
  const check = await withGroupMemberCheck(groupId);
  const postedArticle = await insertArticleQuery(
    check.userId,
    groupId,
    title,
    image,
    content
  );
  if (postedArticle.length === 0) {
    throw new Error();
  }
  return { postedArticle: postedArticle };
}

/**記事の詳細を取得する */
export async function getArticleService(groupId: string, articleId: string) {
  const check = await withGroupMemberCheck(groupId);
  const article = await findArticleQuery(check.userId, groupId, articleId);
  if (article.length <= 0) {
    throw new NotFoundError();
  }
  const normalizedArticles = normalizeArticles(article);
  return { article: normalizedArticles[0] };
}

/**記事を削除する */
export async function deleteArticleService(groupId: string, articleId: string) {
  const check = await withGroupMemberCheck(groupId);
  //投稿者本人か管理者の場合削除
  const deleted = await deleteArticleQuery(check.userId, groupId, articleId);
  if (deleted.length === 0) {
    throw new NotFoundError();
  }
  return { deleted: deleted };
}

/**コメント一覧を取得する */
export async function getCommentsService(groupId: string, articleId: string) {
  await withGroupMemberCheck(groupId);
  const comments = await findCommentsQuery(groupId, articleId);
  return { comments: comments };
}

/**コメントを投稿する */
export async function postCommentService(
  groupId: string,
  articleId: string,
  comment: string
) {
  const check = await withGroupMemberCheck(groupId);
  const postComment = await insertCommentQuery(
    check.userId,
    groupId,
    articleId,
    comment
  );
  if (postComment.length === 0) {
    throw new Error();
  }
  return { postComment: postComment };
}

/**コメントを削除する */
export async function deleteCommentService(groupId: string, commentId: string) {
  await withGroupMemberCheck(groupId);
  const deletedComment = await deleteCommentQuery(commentId);
  if (deletedComment.length === 0) {
    throw new Error();
  }
  return { deletedComment: deletedComment };
}

"use client";

import useSWR from "swr";
import client from "@/libs/honoClient";
import { deleteComment, postComment } from "@/actions/article/articleActions";
import { Comment } from "@/utils/types/articleType";

/**コメントのカスタムフック */
export const useArticleComment = (groupId: string, articleId: string) => {
  const fetcher = async () => {
    const res = await client.api.article.comments[":groupId"][
      ":articleId"
    ].$get({
      param: { groupId, articleId },
    });
    const body = await res.json();
    return body.comments!;
  };
  const key = `/comments/${groupId}/${articleId}`;

  const { data, error, isLoading, mutate } = useSWR<Comment[]>(key, fetcher);

  /**コメントを削除する関数 */
  const handleDeleteComment = async (commentId: string) => {
    mutate(
      (prev) => prev?.filter((comment) => comment.id !== commentId),
      false
    );
    try {
      await deleteComment(commentId, groupId);
    } catch {
      mutate();
    }
  };

  /**コメントを投稿する関数 */
  const handlePostComment = async (
    userProfile: { userId: string; displayName: string; image: string },
    comment: string
  ) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticComment = {
      id: tempId,
      content: comment,
      articleId: articleId,
      groupId: groupId,
      userId: userProfile.userId,
      createdAt: new Date().toString(),
      userProfiles: {
        userId: userProfile.userId,
        displayName: userProfile?.displayName ?? "",
        image: userProfile?.image ?? "",
      },
    } as Comment;

    try {
      mutate((prev) => [optimisticComment, ...(prev ?? [])], false);

      await postComment(comment, groupId, articleId);
      mutate();
    } catch {
      mutate((prev = []) => prev.filter((c) => c.id !== tempId), false);
    }
  };

  return {
    /** コメント一覧*/
    comments: data,
    /**コメント一覧の取得が完了しているかを表すフラグ */
    isLoading,
    /**コメント一覧取得時のエラー */
    error,
    mutate,
    /**コメントを削除する関数 */
    handleDeleteComment,
    /**コメントを投稿する関数 */
    handlePostComment,
  };
};

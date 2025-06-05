"use server";

import { withGroupMemberCheck } from "@/libs/apiUtils";
import { getClient } from "@/libs/hono";
import { postCommentSchema, PostFormSchema } from "@/utils/types/formSchema";
import { parseWithZod } from "@conform-to/zod";

/**
 * 記事を投稿する非同期関数
 * @param {unknown} _ - 使用されない引数（将来の拡張のため）
 * @param {FormData} formData - 投稿フォームのデータ
 * @returns {Promise<{status: string, message: string}>} - 操作の結果（成功または失敗のメッセージ）
 */
export const postArticle = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema: PostFormSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const client = await getClient();
  const { groupId, title, content } = submission.value;
  const res = await client.api.article.$post({
    json: {
      groupId: groupId,
      title: title,
      content: content,
    },
  });
  const body = await res.json();
  const created = body.created;
  if (!created || created.rowCount === 0) {
    return { status: "error", message: "投稿に失敗しました" };
  }
  return { status: "success", message: "投稿しました" };
};

/**コメントを投稿する非同期関数 */
export const postComment = async (_: unknown, fromData: FormData) => {
  const submission = parseWithZod(fromData, { schema: postCommentSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const { groupId, articleId, comment } = submission.value;
  const client = await getClient();
  const res = await client.api.article.comment[":groupId"][":articleId"].$post({
    param: {
      groupId: groupId,
      articleId: articleId,
    },
    json: { comment: comment },
  });
  const body = await res.json();
  if (body.success) {
    return { status: "success", message: "コメントを送信しました" };
  } else {
    return { status: "error", message: "コメントを送信に失敗しました" };
  }
};

/**コメントを削除する非同期関数 */
export const deleteComment = async (commentId: string, groupId: string) => {
  const client = await getClient();
  const res = await client.api.article.comment[":groupId"][
    ":commentId"
  ].$delete({
    param: {
      groupId: groupId,
      commentId: commentId,
    },
  });
  if (!res.ok) {
    throw new Error("コメントの削除に失敗しました");
  }
  const body = await res.json();
  if (!body.success) {
    throw new Error("サーバーから失敗レスポンスが返されました");
  }
  return { success: true };
};

type UploadResponse = {
  success: boolean;
  message: string;
  url: string | null;
};

/**ファイルをR2にアップロードする非同期関数 */
export const uploadR2 = async (formData: FormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/upload/r2`, {
    method: "POST",
    body: formData,
  });
  const body = (await res.json()) as UploadResponse;
  return body;
};

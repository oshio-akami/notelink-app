"use server";

import { getClient } from "@/libs/hono";
import { PostFormSchema } from "@/utils/types/formSchema";
import { parseWithZod } from "@conform-to/zod";

/**
 * 記事を投稿する非同期関数
 * @param {unknown} _ - 使用されない引数（将来の拡張のため）
 * @param {FormData} formData - 投稿フォームのデータ
 * @returns {Promise<{status: string, message: string}>} - 操作の結果（成功または失敗のメッセージ）
 */
export async function postArticle(_: unknown, formData: FormData) {
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
}

/**ファイルをR2にアップロードする非同期関数 */
export const uploadR2 = async (formData: FormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/upload/r2`, {
    method: "POST",
    body: formData,
  });
  const body = await res.json();
  return body;
};

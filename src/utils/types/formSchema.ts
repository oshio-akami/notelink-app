import { z } from "zod";

/**
 * グループ作成フォームのスキーマ
 */
export const createGroupFormSchema = z.object({
  groupName: z
    .string({ required_error: "*グループ名は必須です" })
    .min(1)
    .max(20),
});

export const PostFormSchema = z.object({
  groupId: z.string().uuid(),
  title: z.string({ required_error: "*タイトルは必須です" }),
  image: z.string().default(""),
  content: z.string().default(""),
});

export const postCommentSchema = z.object({
  groupId: z.string().uuid(),
  articleId: z.string().uuid(),
  comment: z.string(),
});

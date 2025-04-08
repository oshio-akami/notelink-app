import {z} from'zod'

/**
 * グループ作成フォームのスキーマ
 */
export const createGroupFormSchema=z.object({
  groupName:z.string({required_error:"*グループ名は必須です"})
  .min(1)
  .max(20),
})
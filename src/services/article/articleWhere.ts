import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

/**mineフラグがtrueの場合自身の記事のみ取得する条件を追加する */
export function articleWhere(userId: string, groupId: string, mine: boolean) {
  const whereConditions = [eq(articles.groupId, groupId)];
  if (mine) {
    whereConditions.push(eq(articles.userId, userId));
  }
  return whereConditions;
}

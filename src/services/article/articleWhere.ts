import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

export function articleWhere(userId: string, groupId: string, mine: boolean) {
  const whereConditions = [eq(articles.groupId, groupId)];
  if (mine) {
    whereConditions.push(eq(articles.userId, userId));
  }
  return whereConditions;
}

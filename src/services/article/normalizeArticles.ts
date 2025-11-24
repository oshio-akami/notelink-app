import { DBArticle } from "@/utils/types/articleType";

export function normalizeArticles(articles: DBArticle[]) {
  return articles.map((a) => ({
    ...a,
    isBookmark: a.isBookmark != null,
  }));
}

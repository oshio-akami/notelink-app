import { DBArticle } from "@/utils/types/articleType";

/**記事のブックマークの可否を文字列からbooleanに変換する */
export function normalizeArticles(articles: DBArticle[]) {
  return articles.map((a) => ({
    ...a,
    isBookmark: a.isBookmark != null,
  }));
}

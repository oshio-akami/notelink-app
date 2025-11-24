import { describe, it, expect } from "vitest";
import { normalizeArticles } from "@/services/article/normalizeArticles";
import { DBArticle } from "@/utils/types/articleType";

describe("normalizeArticles", () => {
  it("converts null isBookmark to false and non-null to true", () => {
    const articles = [
      { id: "Test Id1", isBookmark: null } as unknown as DBArticle,
      { id: "Test Id2", isBookmark: "a" } as unknown as DBArticle,
    ];
    const result = normalizeArticles(articles);
    expect(result).toHaveLength(2);
    expect(result[0].isBookmark).toBe(false);
    expect(result[1].isBookmark).toBe(true);
    expect(result[0].id).toBe("Test Id1");
  });
});

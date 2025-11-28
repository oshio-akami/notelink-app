import { describe, vi, it, expect, beforeEach } from "vitest";

vi.mock("@/db/queries/article", () => ({
  findGroupArticlesQuery: vi.fn(),
  insertArticleQuery: vi.fn(),
  findArticleQuery: vi.fn(),
  deleteArticleQuery: vi.fn(),
}));

vi.mock("@/services/withGroupMemberCheck", () => ({
  withGroupMemberCheck: vi.fn(),
}));

vi.mock("@/services/article/articleWhere", () => ({
  articleWhere: vi.fn(),
}));

vi.mock("@/services/article/normalizeArticles", () => ({
  normalizeArticles: vi.fn(),
}));

vi.mock("@/libs/getSessionUserId", () => ({
  getSessionUserId: vi.fn(),
}));

import * as articleService from "@/services/article/article";
import * as articleQuery from "@/db/queries/article";
import { withGroupMemberCheck } from "@/services/withGroupMemberCheck";
import { articleWhere } from "@/services/article/articleWhere";
import { normalizeArticles } from "@/services/article/normalizeArticles";
import { NotFoundError } from "@/utils/errors";
import { sql, SQL } from "drizzle-orm";
import { DBArticle, PostArticle } from "@/utils/types/articleType";
import {
  MOCK_ARTICLE_ID,
  MOCK_DATE,
  MOCK_GROUP_ID,
  MOCK_USER_ID,
} from "@/tests/__mocks__/testData";

const mockedWithGroupMemberCheck = vi.mocked(withGroupMemberCheck);
const mockedFindGroupArticlesQuery = vi.mocked(
  articleQuery.findGroupArticlesQuery
);
const mockedInsertArticleQuery = vi.mocked(articleQuery.insertArticleQuery);
const mockedFindArticleQuery = vi.mocked(articleQuery.findArticleQuery);
const mockedDeleteArticleQuery = vi.mocked(articleQuery.deleteArticleQuery);
const mockedArticleWhere = vi.mocked(articleWhere);
const mockedNormalizeArticles = vi.mocked(normalizeArticles);

const mockPostedArticles: PostArticle[] = [
  {
    groupId: MOCK_GROUP_ID,
    id: MOCK_ARTICLE_ID,
    userId: MOCK_USER_ID,
    image: "Test Image",
    createdAt: MOCK_DATE(),
    title: "Test Article",
    content: "Test Content",
  },
];
const mockDBArticles: DBArticle[] = [
  {
    ...mockPostedArticles[0],
    isBookmark: null,
    commentCount: 0,
    userProfiles: {
      userId: MOCK_USER_ID,
      displayName: "Test User",
      image: "Test Image",
    },
  },
];

const mockNormalizedArticles = [{ ...mockDBArticles[0], isBookmark: false }];

describe("Article Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: MOCK_USER_ID,
    });
  });

  describe("getArticlesService", () => {
    it("正常: 指定したグループの記事一覧を取得する", async () => {
      const wherePlaceholder: SQL<unknown>[] = [sql`1 = 1`];
      mockedArticleWhere.mockReturnValue(wherePlaceholder);
      mockedFindGroupArticlesQuery.mockResolvedValue(mockDBArticles);
      mockedNormalizeArticles.mockReturnValue(mockNormalizedArticles);

      const result = await articleService.getArticlesService(
        MOCK_GROUP_ID,
        false
      );

      expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(MOCK_GROUP_ID);
      expect(mockedArticleWhere).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_GROUP_ID,
        false
      );
      expect(mockedFindGroupArticlesQuery).toHaveBeenCalledWith(
        MOCK_USER_ID,
        wherePlaceholder
      );
      expect(mockedNormalizeArticles).toHaveBeenCalledWith(mockDBArticles);
      expect(result.articles[0].isBookmark).toBe(false);
    });
  });

  describe("insertArticleService", () => {
    it("エラー: 投稿失敗は Error を投げる", async () => {
      mockedInsertArticleQuery.mockResolvedValue([]);
      await expect(
        articleService.insertArticleService(
          MOCK_GROUP_ID,
          "Test Title",
          "Test Image",
          "Test Content"
        )
      ).rejects.toThrow();
    });

    it("正常: 記事投稿", async () => {
      mockedInsertArticleQuery.mockResolvedValue(mockPostedArticles);
      const result = await articleService.insertArticleService(
        MOCK_GROUP_ID,
        "Test Title",
        "Test Image",
        "Test Content"
      );
      expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(MOCK_GROUP_ID);
      expect(mockedInsertArticleQuery).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_GROUP_ID,
        "Test Title",
        "Test Image",
        "Test Content"
      );
      expect(result.postedArticle).toEqual(mockPostedArticles);
    });
  });

  describe("getArticleService", () => {
    it("エラー: 存在しない記事は NotFoundError を投げる", async () => {
      mockedFindArticleQuery.mockResolvedValue([]);
      await expect(
        articleService.getArticleService(MOCK_GROUP_ID, MOCK_ARTICLE_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("正常: 記事取得と正規化", async () => {
      mockedFindArticleQuery.mockResolvedValue(mockDBArticles);
      mockedNormalizeArticles.mockReturnValue(mockNormalizedArticles);

      const result = await articleService.getArticleService(
        MOCK_GROUP_ID,
        MOCK_ARTICLE_ID
      );
      expect(mockedFindArticleQuery).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_GROUP_ID,
        MOCK_ARTICLE_ID
      );
      expect(mockedNormalizeArticles).toHaveBeenCalledWith(mockDBArticles);
      expect(result.article.id).toBe(MOCK_ARTICLE_ID);
      expect(result.article.isBookmark).toBe(false);
    });
  });

  describe("deleteArticleService", () => {
    it("正常: 記事削除", async () => {
      mockedDeleteArticleQuery.mockResolvedValue(mockPostedArticles);
      const result = await articleService.deleteArticleService(
        MOCK_GROUP_ID,
        MOCK_ARTICLE_ID
      );
      expect(mockedDeleteArticleQuery).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_GROUP_ID,
        MOCK_ARTICLE_ID
      );
      expect(result.deleted).toEqual(mockPostedArticles);
    });
    it("エラー: 存在しない場合は NotFoundError を投げる", async () => {
      mockedDeleteArticleQuery.mockResolvedValue([]);
      await expect(
        articleService.deleteArticleService(MOCK_GROUP_ID, MOCK_ARTICLE_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});

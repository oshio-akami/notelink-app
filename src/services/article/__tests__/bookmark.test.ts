import { describe, vi, it, expect, beforeEach } from "vitest";

vi.mock("@/db/queries/article", () => ({
  insertBookmarkQuery: vi.fn(),
  deleteBookmarkQuery: vi.fn(),
  findBookmarksQuery: vi.fn(),
}));

vi.mock("@/services/withGroupMemberCheck", () => ({
  withGroupMemberCheck: vi.fn(),
}));

vi.mock("@/libs/getSessionUserId", () => ({
  getSessionUserId: vi.fn(),
}));

import * as articleService from "@/services/article/article";
import * as articleQuery from "@/db/queries/article";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { UnauthorizedError, NotFoundError } from "@/utils/errors";
import { Bookmark } from "@/utils/types/articleType";
import { withGroupMemberCheck } from "@/services/withGroupMemberCheck";
import {
  MOCK_ARTICLE_ID,
  MOCK_DATE,
  MOCK_GROUP_ID,
  MOCK_USER_ID,
} from "@/tests/__mocks__/testData";

const mockedGetSessionUserId = vi.mocked(getSessionUserId);
const mockedWithGroupMemberCheck = vi.mocked(withGroupMemberCheck);
const mockedInsertBookmarkQuery = vi.mocked(articleQuery.insertBookmarkQuery);
const mockedDeleteBookmarkQuery = vi.mocked(articleQuery.deleteBookmarkQuery);
const mockedFindBookmarksQuery = vi.mocked(articleQuery.findBookmarksQuery);

const mockBookmarks: Bookmark[] = [
  { userId: MOCK_USER_ID, createdAt: MOCK_DATE(), articleId: MOCK_ARTICLE_ID },
];

describe("Bookmark Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("addBookmarkService", () => {
    it("正常: ブックマーク追加", async () => {
      mockedGetSessionUserId.mockResolvedValue(MOCK_USER_ID);
      mockedInsertBookmarkQuery.mockResolvedValue(mockBookmarks);

      const result = await articleService.addBookmarkService(MOCK_ARTICLE_ID);

      expect(mockedGetSessionUserId).toHaveBeenCalled();
      expect(mockedInsertBookmarkQuery).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_ARTICLE_ID
      );
      expect(result.addBookmark).toEqual(mockBookmarks);
    });

    it("エラー: 未ログインはUnauthorizedError", async () => {
      mockedGetSessionUserId.mockResolvedValue(undefined);

      await expect(
        articleService.addBookmarkService(MOCK_ARTICLE_ID)
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("エラー: insertが空配列ならError", async () => {
      mockedGetSessionUserId.mockResolvedValue(MOCK_USER_ID);
      mockedInsertBookmarkQuery.mockResolvedValue([]);

      await expect(
        articleService.addBookmarkService(MOCK_ARTICLE_ID)
      ).rejects.toThrow();
    });
  });

  describe("deleteBookmarkService", () => {
    it("正常: ブックマーク削除", async () => {
      mockedGetSessionUserId.mockResolvedValue(MOCK_USER_ID);
      mockedDeleteBookmarkQuery.mockResolvedValue(mockBookmarks);

      const result = await articleService.deleteBookmarkService(
        MOCK_ARTICLE_ID
      );

      expect(mockedDeleteBookmarkQuery).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_ARTICLE_ID
      );
      expect(result.deleteBookmark).toEqual(mockBookmarks);
    });

    it("エラー: 未ログインはUnauthorizedError", async () => {
      mockedGetSessionUserId.mockResolvedValue(undefined);

      await expect(
        articleService.deleteBookmarkService(MOCK_ARTICLE_ID)
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("エラー: 存在しない場合はNotFoundError", async () => {
      mockedGetSessionUserId.mockResolvedValue(MOCK_USER_ID);
      mockedDeleteBookmarkQuery.mockResolvedValue([]);

      await expect(
        articleService.deleteBookmarkService(MOCK_ARTICLE_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("getBookmarksService", () => {
    it("正常: ブックマーク一覧取得", async () => {
      mockedWithGroupMemberCheck.mockResolvedValue({
        success: true,
        userId: MOCK_USER_ID,
      });
      mockedFindBookmarksQuery.mockResolvedValue(mockBookmarks);

      const result = await articleService.getBookmarksService(MOCK_GROUP_ID);
      expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(MOCK_GROUP_ID);
      expect(mockedFindBookmarksQuery).toHaveBeenCalledWith(MOCK_USER_ID);
      expect(result.bookmarks).toEqual(mockBookmarks);
    });
  });
});

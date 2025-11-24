import { vi } from "vitest";

vi.mock("@/db/queries/article", () => ({
  findGroupArticlesQuery: vi.fn(),
  insertBookmarkQuery: vi.fn(),
  deleteBookmarkQuery: vi.fn(),
  findBookmarksQuery: vi.fn(),
  insertArticleQuery: vi.fn(),
  findArticleQuery: vi.fn(),
  deleteArticleQuery: vi.fn(),
  findCommentsQuery: vi.fn(),
  insertCommentQuery: vi.fn(),
  deleteCommentQuery: vi.fn(),
}));

vi.mock("@/libs/apiUtils", () => ({
  withGroupMemberCheck: vi.fn(),
}));

vi.mock("@/libs/getSessionUserId", () => ({
  getSessionUserId: vi.fn(),
}));

vi.mock("@/services/article/articleWhere", () => ({
  articleWhere: vi.fn(),
}));

vi.mock("@/services/article/normalizeArticles", () => ({
  normalizeArticles: vi.fn(),
}));

import { describe, it, expect, beforeEach } from "vitest";
import * as articleService from "@/services/article/article";
import {
  findGroupArticlesQuery,
  insertBookmarkQuery,
  deleteBookmarkQuery,
  findBookmarksQuery,
  insertArticleQuery,
  findArticleQuery,
  deleteArticleQuery,
  findCommentsQuery,
  insertCommentQuery,
  deleteCommentQuery,
} from "@/db/queries/article";
import { withGroupMemberCheck } from "@/libs/apiUtils";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { articleWhere } from "@/services/article/articleWhere";
import { normalizeArticles } from "@/services/article/normalizeArticles";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";
import { sql, SQL } from "drizzle-orm";
import {
  Bookmark,
  DBArticle,
  PostArticle,
  PostComment,
} from "@/utils/types/articleType";

const mockedWithGroupMemberCheck = vi.mocked(withGroupMemberCheck);
const mockedFindGroupArticlesQuery = vi.mocked(findGroupArticlesQuery);
const mockedInsertBookmarkQuery = vi.mocked(insertBookmarkQuery);
const mockedDeleteBookmarkQuery = vi.mocked(deleteBookmarkQuery);
const mockedFindBookmarksQuery = vi.mocked(findBookmarksQuery);
const mockedInsertArticleQuery = vi.mocked(insertArticleQuery);
const mockedFindArticleQuery = vi.mocked(findArticleQuery);
const mockedDeleteArticleQuery = vi.mocked(deleteArticleQuery);
const mockedFindCommentsQuery = vi.mocked(findCommentsQuery);
const mockedInsertCommentQuery = vi.mocked(insertCommentQuery);
const mockedDeleteCommentQuery = vi.mocked(deleteCommentQuery);
const mockedGetSessionUserId = vi.mocked(getSessionUserId);
const mockedArticleWhere = vi.mocked(articleWhere);
const mockedNormalizeArticles = vi.mocked(normalizeArticles);

const TEST_DATE = new Date("2025-01-01T00:00:00.000Z");

describe("Article Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockGroupId = "11111111-1111-1111-1111-111111111111";
  const mockUserId = "22222222-2222-2222-2222-222222222222";
  const mockArticleId = "33333333-3333-3333-3333-333333333333";
  const mockCommentId = "44444444-4444-4444-4444-444444444444";
  const mockPostedArticles: PostArticle[] = [
    {
      groupId: mockGroupId,
      id: mockArticleId,
      userId: mockUserId,
      image: "Test Image",
      createdAt: TEST_DATE,
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
        userId: mockUserId,
        displayName: "Test User",
        image: "Test Image",
      },
    },
  ];

  const mockNormalizedArticles = [{ ...mockDBArticles[0], isBookmark: false }];

  const mockBookmarks: Bookmark[] = [
    { userId: mockUserId, createdAt: TEST_DATE, articleId: mockArticleId },
  ];

  const mockPostedComments: PostComment[] = [
    {
      id: mockCommentId,
      articleId: mockArticleId,
      groupId: mockGroupId,
      userId: mockUserId,
      createdAt: TEST_DATE,
      comment: "Test Comment",
    },
  ];

  const mockComments = [
    {
      userProfiles: {
        userId: mockUserId,
        displayName: "Test User",
        image: "Test Image",
      },
      content: "Test Content",
      ...mockPostedComments[0],
    },
  ];

  it("正常: 指定したグループの記事一覧を取得する", async () => {
    const wherePlaceholder: SQL<unknown>[] = [sql`1 = 1`];
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedArticleWhere.mockReturnValue(wherePlaceholder);
    mockedFindGroupArticlesQuery.mockResolvedValue(mockDBArticles);
    mockedNormalizeArticles.mockReturnValue(mockNormalizedArticles);
    const result = await articleService.getArticlesService(mockGroupId, false);
    expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(mockGroupId);
    expect(mockedArticleWhere).toHaveBeenCalledWith(
      mockUserId,
      mockGroupId,
      false
    );

    expect(mockedFindGroupArticlesQuery).toHaveBeenCalledWith(
      mockUserId,
      wherePlaceholder
    );
    expect(result.articles[0].isBookmark).toBe(false);
  });

  it("正常: addBookmarkService ブックマーク追加", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    const added = mockBookmarks;
    mockedInsertBookmarkQuery.mockResolvedValue(mockBookmarks);
    const result = await articleService.addBookmarkService(mockArticleId);
    expect(mockedGetSessionUserId).toHaveBeenCalled();
    expect(mockedInsertBookmarkQuery).toHaveBeenCalledWith(
      mockUserId,
      mockArticleId
    );
    expect(result.addBookmark).toEqual(added);
  });

  it("エラー: addBookmarkService 未ログインは UnauthorizedError を投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(undefined);
    await expect(
      articleService.addBookmarkService(mockArticleId)
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("エラー: addBookmarkService insert が空配列ならエラーを投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedInsertBookmarkQuery.mockResolvedValue([]);
    await expect(
      articleService.addBookmarkService(mockArticleId)
    ).rejects.toBeInstanceOf(Error);
  });

  it("正常: deleteBookmarkService ブックマーク削除", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedDeleteBookmarkQuery.mockResolvedValue(mockBookmarks);
    const result = await articleService.deleteBookmarkService(mockArticleId);
    expect(mockedGetSessionUserId).toHaveBeenCalled();
    expect(mockedDeleteBookmarkQuery).toHaveBeenCalledWith(
      mockUserId,
      mockArticleId
    );
    expect(result.deleteBookmark).toEqual(mockBookmarks);
  });

  it("エラー: deleteBookmarkService 未ログインは UnauthorizedError を投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(undefined);
    await expect(
      articleService.deleteBookmarkService(mockArticleId)
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("エラー: deleteBookmarkService 存在しない場合は NotFoundError を投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedDeleteBookmarkQuery.mockResolvedValue([]);
    await expect(
      articleService.deleteBookmarkService(mockArticleId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("正常: getBookmarksService ブックマーク一覧取得", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedFindBookmarksQuery.mockResolvedValue(mockBookmarks);

    const result = await articleService.getBookmarksService(mockGroupId);
    expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(mockGroupId);
    expect(mockedFindBookmarksQuery).toHaveBeenCalledWith(mockUserId);
    expect(result.bookmarks).toEqual(mockBookmarks);
  });

  it("エラー: insertArticleService 投稿失敗は Error を投げる", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedInsertArticleQuery.mockResolvedValue([]);
    await expect(
      articleService.insertArticleService(
        mockGroupId,
        "Test Title",
        "Test Image",
        "Test Content"
      )
    ).rejects.toThrow();
  });

  it("正常: insertArticleService 記事投稿", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedInsertArticleQuery.mockResolvedValue(mockPostedArticles);

    const result = await articleService.insertArticleService(
      mockGroupId,
      "Test Title",
      "Test Image",
      "Test Content"
    );
    expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(mockGroupId);
    expect(mockedInsertArticleQuery).toHaveBeenCalledWith(
      mockUserId,
      mockGroupId,
      "Test Title",
      "Test Image",
      "Test Content"
    );
    expect(result.postedArticle).toEqual(mockPostedArticles);
  });

  it("エラー: getArticleService 存在しない記事は NotFoundError を投げる", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedFindArticleQuery.mockResolvedValue([]);
    await expect(
      articleService.getArticleService(mockGroupId, mockArticleId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("正常: getArticleService 記事取得と正規化", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedFindArticleQuery.mockResolvedValue(mockDBArticles);
    mockedNormalizeArticles.mockReturnValue(mockNormalizedArticles);

    const result = await articleService.getArticleService(
      mockGroupId,
      mockArticleId
    );
    expect(mockedFindArticleQuery).toHaveBeenCalledWith(
      mockUserId,
      mockGroupId,
      mockArticleId
    );
    expect(result.article.id).toBe(mockArticleId);
    expect(result.article.isBookmark).toBe(false);
  });

  it("エラー: deleteArticleService 存在しない場合は NotFoundError を投げる", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedDeleteArticleQuery.mockResolvedValue([]);
    await expect(
      articleService.deleteArticleService(mockGroupId, mockArticleId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("正常: deleteArticleService 記事削除", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedDeleteArticleQuery.mockResolvedValue(mockPostedArticles);

    const result = await articleService.deleteArticleService(
      mockGroupId,
      mockArticleId
    );
    expect(mockedDeleteArticleQuery).toHaveBeenCalledWith(
      mockUserId,
      mockGroupId,
      mockArticleId
    );
    expect(result.deleted).toEqual(mockPostedArticles);
  });

  it("正常: getCommentsService コメント一覧取得", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedFindCommentsQuery.mockResolvedValue(mockComments);

    const result = await articleService.getCommentsService(
      mockGroupId,
      mockArticleId
    );
    expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(mockGroupId);
    expect(mockedFindCommentsQuery).toHaveBeenCalledWith(
      mockGroupId,
      mockArticleId
    );
    expect(result.comments).toEqual(mockComments);
  });

  it("エラー: postCommentService 投稿失敗は Error を投げる", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedInsertCommentQuery.mockResolvedValue([]);
    await expect(
      articleService.postCommentService(
        mockGroupId,
        mockArticleId,
        "Test Comment"
      )
    ).rejects.toThrow();
  });

  it("正常: postCommentService コメント投稿", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedInsertCommentQuery.mockResolvedValue(mockPostedComments);

    const result = await articleService.postCommentService(
      mockGroupId,
      mockArticleId,
      "Test Comment"
    );
    expect(mockedInsertCommentQuery).toHaveBeenCalledWith(
      mockUserId,
      mockGroupId,
      mockArticleId,
      "Test Comment"
    );
    expect(result.postComment).toEqual(mockPostedComments);
  });

  it("エラー: deleteCommentService 削除失敗は Error を投げる", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedDeleteCommentQuery.mockResolvedValue([]);
    await expect(
      articleService.deleteCommentService(mockGroupId, mockCommentId)
    ).rejects.toThrow();
  });

  it("正常: deleteCommentService コメント削除", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockUserId,
    });
    mockedDeleteCommentQuery.mockResolvedValue(mockPostedComments);

    const result = await articleService.deleteCommentService(
      mockGroupId,
      mockCommentId
    );
    expect(mockedDeleteCommentQuery).toHaveBeenCalledWith(mockCommentId);
    expect(result.deletedComment).toEqual(mockPostedComments);
  });
});

import { describe, vi, it, expect, beforeEach } from "vitest";

vi.mock("@/db/queries/article", () => ({
  findCommentsQuery: vi.fn(),
  insertCommentQuery: vi.fn(),
  deleteCommentQuery: vi.fn(),
}));

vi.mock("@/services/withGroupMemberCheck", () => ({
  withGroupMemberCheck: vi.fn(),
}));

vi.mock("@/libs/getSessionUserId", () => ({
  getSessionUserId: vi.fn(),
}));

import * as articleService from "@/services/article/article";
import * as articleQuery from "@/db/queries/article";
import { withGroupMemberCheck } from "@/services/withGroupMemberCheck";
import { PostComment } from "@/utils/types/articleType";
import {
  MOCK_ARTICLE_ID,
  MOCK_COMMENT_ID,
  MOCK_DATE,
  MOCK_GROUP_ID,
  MOCK_USER_ID,
} from "@/tests/__mocks__/testData";

const mockedWithGroupMemberCheck = vi.mocked(withGroupMemberCheck);
const mockedFindCommentsQuery = vi.mocked(articleQuery.findCommentsQuery);
const mockedInsertCommentQuery = vi.mocked(articleQuery.insertCommentQuery);
const mockedDeleteCommentQuery = vi.mocked(articleQuery.deleteCommentQuery);

const mockPostedComments: PostComment[] = [
  {
    id: MOCK_COMMENT_ID,
    articleId: MOCK_ARTICLE_ID,
    groupId: MOCK_GROUP_ID,
    userId: MOCK_USER_ID,
    createdAt: MOCK_DATE(),
    comment: "Test Comment",
  },
];

const mockComments = [
  {
    userProfiles: {
      userId: MOCK_USER_ID,
      displayName: "Test User",
      image: "Test Image",
    },
    content: "Test Content",
    ...mockPostedComments[0],
  },
];

describe("Comment Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: MOCK_USER_ID,
    });
  });

  describe("getCommentsService", () => {
    it("正常: コメント一覧取得", async () => {
      mockedFindCommentsQuery.mockResolvedValue(mockComments);

      const result = await articleService.getCommentsService(
        MOCK_GROUP_ID,
        MOCK_ARTICLE_ID
      );

      expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(MOCK_GROUP_ID);
      expect(mockedFindCommentsQuery).toHaveBeenCalledWith(
        MOCK_GROUP_ID,
        MOCK_ARTICLE_ID
      );
      expect(result.comments).toEqual(mockComments);
    });
  });

  describe("postCommentService", () => {
    it("正常: コメント投稿", async () => {
      mockedInsertCommentQuery.mockResolvedValue(mockPostedComments);

      const result = await articleService.postCommentService(
        MOCK_GROUP_ID,
        MOCK_ARTICLE_ID,
        "Test Comment"
      );

      expect(mockedInsertCommentQuery).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_GROUP_ID,
        MOCK_ARTICLE_ID,
        "Test Comment"
      );
      expect(result.postComment).toEqual(mockPostedComments);
    });

    it("エラー: 投稿失敗はErrorを投げる", async () => {
      mockedInsertCommentQuery.mockResolvedValue([]);

      await expect(
        articleService.postCommentService(
          MOCK_GROUP_ID,
          MOCK_ARTICLE_ID,
          "Test Comment"
        )
      ).rejects.toThrow();
    });
  });

  describe("deleteCommentService", () => {
    it("正常: コメント削除", async () => {
      mockedDeleteCommentQuery.mockResolvedValue(mockPostedComments);

      const result = await articleService.deleteCommentService(
        MOCK_GROUP_ID,
        MOCK_COMMENT_ID
      );

      expect(mockedDeleteCommentQuery).toHaveBeenCalledWith(MOCK_COMMENT_ID);
      expect(result.deletedComment).toEqual(mockPostedComments);
    });

    it("エラー: 削除失敗はErrorを投げる", async () => {
      mockedDeleteCommentQuery.mockResolvedValue([]);

      await expect(
        articleService.deleteCommentService(MOCK_GROUP_ID, MOCK_COMMENT_ID)
      ).rejects.toThrow();
    });
  });
});

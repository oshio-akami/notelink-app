import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/services/article/article", () => ({
  getArticlesService: vi.fn(),
  addBookmarkService: vi.fn(),
  deleteBookmarkService: vi.fn(),
  getBookmarksService: vi.fn(),
  insertArticleService: vi.fn(),
  getArticleService: vi.fn(),
  deleteArticleService: vi.fn(),
  getCommentsService: vi.fn(),
  postCommentService: vi.fn(),
  deleteCommentService: vi.fn(),
}));

import article from "../article";
import { Bookmark, Comment } from "@/utils/types/articleType.js";
import * as articleService from "@/services/article/article";

type Article = {
  userProfiles: {
    userId: string;
    displayName: string;
    image: string;
  };
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: Date;
  isBookmark: boolean;
  commentCount: number;
};
type Success = {
  success: boolean;
};

type PostedArticle = {
  groupId: string;
  id: string;
  image: string;
  userId: string;
  createdAt: Date;
  title: string;
  content: string;
};

type PostedComment = {
  groupId: string;
  articleId: string;
  id: string;
  userId: string;
  createdAt: Date;
  comment: string;
};

const mockedGetArticlesService = vi.mocked(articleService.getArticlesService);
const mockedAddBookmarkService = vi.mocked(articleService.addBookmarkService);
const mockedDeleteBookmarkService = vi.mocked(
  articleService.deleteBookmarkService
);
const mockedGetBookmarksService = vi.mocked(articleService.getBookmarksService);
const mockedInsertArticleService = vi.mocked(
  articleService.insertArticleService
);
const mockedGetArticleService = vi.mocked(articleService.getArticleService);
const mockedDeleteArticleService = vi.mocked(
  articleService.deleteArticleService
);
const mockedGetCommentsService = vi.mocked(articleService.getCommentsService);
const mockedPostCommentService = vi.mocked(articleService.postCommentService);
const mockedDeleteCommentService = vi.mocked(
  articleService.deleteCommentService
);

describe("記事APIのRoute", () => {
  const mockGroupId = "11111111-1111-1111-1111-111111111111";
  const mockUserId = "22222222-2222-2222-2222-222222222222";
  const mockArticleId = "33333333-3333-3333-3333-333333333333";
  const mockCommentId = "44444444-4444-4444-4444-444444444444";
  const mockArticle: Article = {
    isBookmark: true,
    userProfiles: {
      userId: mockUserId,
      displayName: "Test User",
      image: "Test Image",
    },
    id: mockArticleId,
    title: "Test Article",
    content: "Test Content",
    image: "",
    createdAt: new Date(),
    commentCount: 5,
  };
  const mockPostedArticle: PostedArticle = {
    groupId: mockGroupId,
    id: mockArticleId,
    userId: mockUserId,
    image: "",
    createdAt: new Date(),
    title: "Test Article",
    content: "Test Content",
  };
  const mockBookmark: Bookmark = {
    userId: mockUserId,
    createdAt: new Date(),
    articleId: mockArticleId,
  };
  const mockComment = {
    userProfiles: {
      userId: mockUserId,
      displayName: "Test User",
      image: "Test Image",
    },
    id: mockCommentId,
    articleId: mockArticleId,
    groupId: mockGroupId,
    userId: mockUserId,
    createdAt: new Date(),
    content: "Test Comment",
  };

  const mockPostedComment: PostedComment = {
    id: mockCommentId,
    articleId: mockArticleId,
    groupId: mockGroupId,
    userId: mockUserId,
    createdAt: new Date(),
    comment: "Test Comment",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /:groupId/articles 記事一覧の取得", async () => {
    mockedGetArticlesService.mockResolvedValue({
      articles: [mockArticle],
    });

    const req = new Request(`http://localhost/${mockGroupId}/articles`);
    const res = await article.fetch(req);
    const body = (await res.json()) as { articles: Article[] };
    expect(res.status).toBe(200);
    expect(body.articles).toHaveLength(1);
    expect(body.articles[0].title).toBe("Test Article");
  });

  it("POST /bookmark/:articleId ブックマーク追加", async () => {
    mockedAddBookmarkService.mockResolvedValue({
      addBookmark: [mockBookmark],
    });

    const req = new Request(`http://localhost/bookmark/${mockArticleId}`, {
      method: "POST",
    });
    const res = await article.fetch(req);
    const body = (await res.json()) as Success;

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("DELETE /bookmark/:articleId ブックマーク削除", async () => {
    mockedDeleteBookmarkService.mockResolvedValue({
      deleteBookmark: [mockBookmark],
    });

    const req = new Request(`http://localhost/bookmark/${mockArticleId}`, {
      method: "DELETE",
    });
    const res = await article.fetch(req);
    const body = (await res.json()) as Success;

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("GET /:groupId/bookmarks ブックマーク一覧取得", async () => {
    mockedGetBookmarksService.mockResolvedValue({
      bookmarks: [mockBookmark],
    });

    const req = new Request(`http://localhost/${mockGroupId}/bookmarks`);
    const res = await article.fetch(req);
    const body = (await res.json()) as {
      bookmarkList: { userId: string; articleId: string }[];
    };

    expect(res.status).toBe(200);
    expect(body.bookmarkList[0].articleId).toBe(mockArticleId);
  });

  it("POST / 記事投稿", async () => {
    mockedInsertArticleService.mockResolvedValue({
      postedArticle: [mockPostedArticle],
    });

    const req = new Request(`http://localhost/`, {
      method: "POST",
      body: JSON.stringify({
        groupId: mockGroupId,
        title: "Test New Article",
        content: "This is a test article",
        image: "",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await article.fetch(req);
    const body = (await res.json()) as { created: PostedArticle[] };

    expect(res.status).toBe(200);
    expect(body.created[0].groupId).toBe(mockGroupId);
  });

  it("GET /:groupId/:articleId 記事取得", async () => {
    mockedGetArticleService.mockResolvedValue({
      article: mockArticle,
    });

    const req = new Request(`http://localhost/${mockGroupId}/${mockArticleId}`);
    const res = await article.fetch(req);
    const body = (await res.json()) as { article: Article };

    expect(res.status).toBe(200);
    expect(body.article.id).toBe(mockArticleId);
  });

  it("DELETE /:groupId/:articleId 記事削除", async () => {
    mockedDeleteArticleService.mockResolvedValue({
      deleted: [mockPostedArticle],
    });

    const req = new Request(
      `http://localhost/${mockGroupId}/${mockArticleId}`,
      {
        method: "DELETE",
      }
    );
    const res = await article.fetch(req);
    const body = (await res.json()) as Success;

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("GET /comments/:groupId/:articleId コメント一覧取得", async () => {
    mockedGetCommentsService.mockResolvedValue({
      comments: [mockComment],
    });

    const req = new Request(
      `http://localhost/comments/${mockGroupId}/${mockArticleId}`
    );
    const res = await article.fetch(req);
    const body = (await res.json()) as { comments: Comment[] };

    expect(res.status).toBe(200);
    expect(body.comments[0].content).toBe("Test Comment");
  });

  it("POST /comment/:groupId/:articleId コメント投稿", async () => {
    mockedPostCommentService.mockResolvedValue({
      postComment: [mockPostedComment],
    });

    const req = new Request(
      `http://localhost/comment/${mockGroupId}/${mockArticleId}`,
      {
        method: "POST",
        body: JSON.stringify({ comment: "Hello Comment" }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const res = await article.fetch(req);
    const body = (await res.json()) as Success;

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("DELETE /comment/:groupId/:commentId コメント削除", async () => {
    mockedDeleteCommentService.mockResolvedValue({
      deletedComment: [mockPostedComment],
    });

    const req = new Request(
      `http://localhost/comment/${mockGroupId}/${mockCommentId}`,
      {
        method: "DELETE",
      }
    );
    const res = await article.fetch(req);
    const body = (await res.json()) as Success;

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });
});

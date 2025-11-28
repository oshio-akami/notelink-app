import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/db/queries/invite", () => ({
  findInviteTokenQuery: vi.fn(),
  insertInviteTokenQuery: vi.fn(),
  findInviteDataQuery: vi.fn(),
}));

vi.mock("@/services/user/user", () => ({
  hasJoinedGroupService: vi.fn(),
}));

import * as inviteService from "@/services/invite/invite";
import * as inviteQuery from "@/db/queries/invite";
import { hasJoinedGroupService } from "@/services/user/user";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";
import { MOCK_GROUP_ID } from "@/tests/__mocks__/testData";

const mockedFindInviteTokenQuery = vi.mocked(inviteQuery.findInviteTokenQuery);
const mockedInsertInviteTokenQuery = vi.mocked(
  inviteQuery.insertInviteTokenQuery
);
const mockedFindInviteDataQuery = vi.mocked(inviteQuery.findInviteDataQuery);
const mockedHasJoinedGroupService = vi.mocked(hasJoinedGroupService);

const mockTokenId = 0;
const mockToken = "test-token";
const mockInviteData = [
  {
    groupInvites: {
      id: mockTokenId,
      groupId: MOCK_GROUP_ID,
      token: mockToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      createdAt: new Date(),
    },
  },
];
const mockExpiredInviteData = [
  {
    groupInvites: {
      id: mockTokenId,
      groupId: MOCK_GROUP_ID,
      token: mockToken,
      expiresAt: new Date(Date.now() - 1000 * 60 * 60),
      createdAt: new Date(),
    },
  },
];

describe("Invite Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("validateTokenService", () => {
    it("正常: トークンが有効なら groupId を返す", async () => {
      mockedFindInviteTokenQuery.mockResolvedValue(mockInviteData);
      const result = await inviteService.validateTokenService(mockToken);
      expect(result.groupId).toBe(MOCK_GROUP_ID);
    });

    it("エラー: トークンが存在しない場合 NotFoundError", async () => {
      mockedFindInviteTokenQuery.mockResolvedValue([]);
      await expect(
        inviteService.validateTokenService(mockToken)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("エラー: トークンが期限切れの場合 NotFoundError", async () => {
      mockedFindInviteTokenQuery.mockResolvedValue(mockExpiredInviteData);
      await expect(
        inviteService.validateTokenService(mockToken)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("createInviteTokenService", () => {
    it("正常: トークン生成", async () => {
      mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });
      mockedInsertInviteTokenQuery.mockResolvedValue([
        mockInviteData[0].groupInvites,
      ]);
      const result = await inviteService.createInviteTokenService(
        MOCK_GROUP_ID
      );
      expect(result.token).toBe(mockToken);
    });

    it("エラー: 非参加ユーザーの場合 UnauthorizedError", async () => {
      mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: false });
      await expect(
        inviteService.createInviteTokenService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("エラー: 作成結果が空の場合 NotFoundError", async () => {
      mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });
      mockedInsertInviteTokenQuery.mockResolvedValue([]);
      await expect(
        inviteService.createInviteTokenService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("getInviteTokenService", () => {
    it("正常: 有効なトークンを取得", async () => {
      mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });
      mockedFindInviteDataQuery.mockResolvedValue(mockInviteData);
      const result = await inviteService.getInviteTokenService(MOCK_GROUP_ID);
      expect(result.token).toBe(mockToken);
    });

    it("エラー: 非参加ユーザーの場合 UnauthorizedError", async () => {
      mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: false });
      await expect(
        inviteService.getInviteTokenService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("エラー: データが存在しない場合 NotFoundError", async () => {
      mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });
      mockedFindInviteDataQuery.mockResolvedValue([]);
      await expect(
        inviteService.getInviteTokenService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("エラー: token が空の場合 NotFoundError", async () => {
      mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });
      mockedFindInviteDataQuery.mockResolvedValue([]);
      await expect(
        inviteService.getInviteTokenService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("エラー: 期限切れの場合 NotFoundError", async () => {
      mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });
      mockedFindInviteDataQuery.mockResolvedValue(mockExpiredInviteData);
      await expect(
        inviteService.getInviteTokenService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});

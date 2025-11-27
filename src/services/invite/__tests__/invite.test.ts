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

// mock参照
const mockedFindInviteTokenQuery = vi.mocked(inviteQuery.findInviteTokenQuery);
const mockedInsertInviteTokenQuery = vi.mocked(
  inviteQuery.insertInviteTokenQuery
);
const mockedFindInviteDataQuery = vi.mocked(inviteQuery.findInviteDataQuery);
const mockedHasJoinedGroupService = vi.mocked(hasJoinedGroupService);

describe("Invite Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockTokenId = 0;
  const mockGroupId = "11111111-1111-1111-1111-111111111111";
  const mockToken = "test-token";
  const mockInviteData = [
    {
      groupInvites: {
        id: mockTokenId,
        groupId: mockGroupId,
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
        groupId: mockGroupId,
        token: mockToken,
        expiresAt: new Date(Date.now() - 1000 * 60 * 60),
        createdAt: new Date(),
      },
    },
  ];

  it("正常: validateTokenService - トークンが有効なら groupId を返す", async () => {
    mockedFindInviteTokenQuery.mockResolvedValue(mockInviteData);

    const result = await inviteService.validateTokenService(mockToken);

    expect(mockedFindInviteTokenQuery).toHaveBeenCalledWith(mockToken);
    expect(result.groupId).toBe(mockGroupId);
  });

  it("エラー: validateTokenService - トークンが存在しない場合NotFoundErrorを投げる", async () => {
    mockedFindInviteTokenQuery.mockResolvedValue([]);

    await expect(
      inviteService.validateTokenService(mockToken)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("エラー: validateTokenService - トークンが期限切れの場合NotFoundErrorを投げる", async () => {
    mockedFindInviteTokenQuery.mockResolvedValue(mockExpiredInviteData);

    await expect(
      inviteService.validateTokenService(mockToken)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("正常: createInviteTokenService - トークン生成", async () => {
    mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });
    mockedInsertInviteTokenQuery.mockResolvedValue([
      mockInviteData[0].groupInvites,
    ]);

    const result = await inviteService.createInviteTokenService(mockGroupId);

    expect(mockedHasJoinedGroupService).toHaveBeenCalledWith(mockGroupId);
    expect(mockedInsertInviteTokenQuery).toHaveBeenCalledWith(mockGroupId);
    expect(result.token).toBe(mockToken);
  });

  it("エラー: createInviteTokenService - 非参加ユーザーの場合UnauthorizedErrorを投げる", async () => {
    mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: false });

    await expect(
      inviteService.createInviteTokenService(mockGroupId)
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("エラー: createInviteTokenService - 作成結果が空の場合NotFoundErrorを投げる", async () => {
    mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });
    mockedInsertInviteTokenQuery.mockResolvedValue([]);

    await expect(
      inviteService.createInviteTokenService(mockGroupId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("正常: getInviteTokenService - 有効なトークンを取得", async () => {
    mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });

    mockedFindInviteDataQuery.mockResolvedValue(mockInviteData);

    const result = await inviteService.getInviteTokenService(mockGroupId);

    expect(mockedHasJoinedGroupService).toHaveBeenCalledWith(mockGroupId);
    expect(mockedFindInviteDataQuery).toHaveBeenCalledWith(mockGroupId);
    expect(result.token).toBe(mockToken);
  });

  it("エラー: getInviteTokenService - 非参加ユーザーの場合UnauthorizedErrorを投げる", async () => {
    mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: false });

    await expect(
      inviteService.getInviteTokenService(mockGroupId)
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("エラー: getInviteTokenService - データが存在しないの場合NotFoundErrorを投げる", async () => {
    mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });
    mockedFindInviteDataQuery.mockResolvedValue([]);

    await expect(
      inviteService.getInviteTokenService(mockGroupId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("エラー: getInviteTokenService - tokenが空の場合NotFoundErrorを投げる", async () => {
    mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });

    mockedFindInviteDataQuery.mockResolvedValue([]);

    await expect(
      inviteService.getInviteTokenService(mockGroupId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("エラー: getInviteTokenService - 期限切れの場合NotFoundErrorを投げる", async () => {
    mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });

    mockedFindInviteDataQuery.mockResolvedValue(mockExpiredInviteData);

    await expect(
      inviteService.getInviteTokenService(mockGroupId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

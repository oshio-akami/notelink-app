import { vi } from "vitest";

vi.mock("@/db/queries/user", () => ({
  hasJoinedGroupQuery: vi.fn(),
  findUserProfileQuery: vi.fn(),
  findGroupUserProfileQuery: vi.fn(),
  findGroupsQuery: vi.fn(),
  findGroupSummariesQuery: vi.fn(),
  updateCurrentGroupQuery: vi.fn(),
  deleteUserToGroupQuery: vi.fn(),
}));

vi.mock("@/db/queries/group", () => ({
  insertAdminToGroup: vi.fn(),
  insertMemberToGroup: vi.fn(),
}));

vi.mock("@/services/withGroupMemberCheck", () => ({
  withGroupMemberCheck: vi.fn(),
}));

vi.mock("@/libs/getSessionUserId", () => ({
  getSessionUserId: vi.fn(),
}));

import { describe, it, expect, beforeEach } from "vitest";
import * as userService from "@/services/user/user";

import * as userQuery from "@/db/queries/user";

import { insertAdminToGroup, insertMemberToGroup } from "@/db/queries/group";

import { withGroupMemberCheck } from "@/services/withGroupMemberCheck";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";

const mockedHasJoinedQuery = vi.mocked(userQuery.hasJoinedGroupQuery);
const mockedFindUserProfileQuery = vi.mocked(userQuery.findUserProfileQuery);
const mockedFindGroupUserProfileQuery = vi.mocked(
  userQuery.findGroupUserProfileQuery
);
const mockedFindGroupsQuery = vi.mocked(userQuery.findGroupsQuery);
const mockedFindSummariesQuery = vi.mocked(userQuery.findGroupSummariesQuery);
const mockedUpdateCurrentGroupQuery = vi.mocked(
  userQuery.updateCurrentGroupQuery
);
const mockedDeleteUserToGroupQuery = vi.mocked(
  userQuery.deleteUserToGroupQuery
);
const mockedInsertAdmin = vi.mocked(insertAdminToGroup);
const mockedInsertMember = vi.mocked(insertMemberToGroup);
const mockedCheck = vi.mocked(withGroupMemberCheck);
const mockedGetSessionUserId = vi.mocked(getSessionUserId);

type UserProfile = {
  userId: string;
  displayName: string;
  image: string;
  about: string;
  currentGroupId: string | null;
};

type GroupSummary = {
  groupId: string;
  groupName: string;
  postCount: number;
  lastPostAt: Date | null;
  memberCount: number;
};

const TEST_DATE = new Date("2025-01-01T00:00:00.000Z");

describe("User Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockUserId = "11111111-1111";
  const mockGroupId = "22222222-2222";
  const mockAdminRoleId = 1;
  const mockUserRoleId = 2;
  const mockUserProfiles: UserProfile[] = [
    {
      userId: mockUserId,
      displayName: "Test Name",
      image: "Test Image",
      about: "Test About",
      currentGroupId: mockGroupId,
    },
  ];
  const mockGroupSummaries: GroupSummary[] = [
    {
      groupId: mockGroupId,
      groupName: "Test Group",
      postCount: 3,
      lastPostAt: TEST_DATE,
      memberCount: 2,
    },
  ];

  it("正常: 参加済みチェック", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedHasJoinedQuery.mockResolvedValue([
      { userId: mockUserId, groupId: mockGroupId, roleId: mockAdminRoleId },
    ]);

    const result = await userService.hasJoinedGroupService(mockGroupId);
    expect(result.hasJoinedGroup).toBe(true);
  });

  it("エラー: 未ログインの場合はUnauthorizedErrorを投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(undefined);

    await expect(
      userService.hasJoinedGroupService(mockGroupId)
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("正常: ロールがAdminの場合insertAdminToGroup", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedInsertAdmin.mockResolvedValue([
      { userId: mockUserId, groupId: mockGroupId, roleId: mockAdminRoleId },
    ]);

    const result = await userService.joinGroupService(
      mockGroupId,
      mockAdminRoleId
    );

    expect(mockedInsertAdmin).toHaveBeenCalledWith(mockUserId, mockGroupId);
    expect(result.joinedGroup.groupId).toBe(mockGroupId);
  });

  it("正常: ロールがUserの場合insertMemberToGroup", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedInsertMember.mockResolvedValue([
      { userId: mockUserId, groupId: mockGroupId, roleId: mockUserRoleId },
    ]);

    const result = await userService.joinGroupService(
      mockGroupId,
      mockUserRoleId
    );

    expect(mockedInsertMember).toHaveBeenCalledWith(mockUserId, mockGroupId);
    expect(result.joinedGroup.groupId).toBe(mockGroupId);
  });

  it("エラー: 未ログインの場合はUnauthorizedErrorを投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(undefined);

    await expect(
      userService.joinGroupService(mockGroupId, mockAdminRoleId)
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("正常: currentGroupの更新", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedUpdateCurrentGroupQuery.mockResolvedValue(mockUserProfiles);

    const result = await userService.setCurrentGroupService(mockGroupId);
    expect(result.success).toBe(true);
  });

  it("エラー: 更新失敗した場合はErrorを投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedUpdateCurrentGroupQuery.mockResolvedValue([]);

    await expect(
      userService.setCurrentGroupService(mockGroupId)
    ).rejects.toThrowError();
  });

  it("正常: プロフィールにcurrentGroupがある", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedFindUserProfileQuery.mockResolvedValue(mockUserProfiles);

    const result = await userService.getCurrentGroupService();
    expect(result.currentGroupId).toBe(mockGroupId);
  });

  it("正常: currentGroupが無い場合groupsの1件目を採用", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedFindUserProfileQuery.mockResolvedValue([]);
    mockedFindGroupsQuery.mockResolvedValue([
      { groupId: mockGroupId, groupName: "Test Group" },
    ]);
    mockedUpdateCurrentGroupQuery.mockResolvedValue(mockUserProfiles);

    const result = await userService.getCurrentGroupService();
    expect(result.currentGroupId).toBe(mockGroupId);
  });

  it("エラー: groupsが0件の場合はNotFoundErrorを投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedFindUserProfileQuery.mockResolvedValue([]);
    mockedFindGroupsQuery.mockResolvedValue([]);

    await expect(userService.getCurrentGroupService()).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it("正常: 所属グループ取得", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedFindGroupsQuery.mockResolvedValue([
      { groupId: mockGroupId, groupName: "Test Group" },
    ]);

    const result = await userService.getGroupsService();
    expect(result.groups.length).toBe(1);
  });

  it("エラー: 未ログインの場合はUnauthorizedErrorを投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(undefined);

    await expect(userService.getGroupsService()).rejects.toBeInstanceOf(
      UnauthorizedError
    );
  });

  it("正常: グループサマリ取得", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedFindSummariesQuery.mockResolvedValue(mockGroupSummaries);

    const result = await userService.getGroupSummariesService();
    expect(result.groupSummaries.length).toBe(1);
  });

  it("正常: グループ退出", async () => {
    mockedCheck.mockResolvedValue({ success: true, userId: mockUserId });
    mockedDeleteUserToGroupQuery.mockResolvedValue([
      { userId: mockUserId, groupId: mockGroupId, roleId: mockAdminRoleId },
    ]);

    await expect(
      userService.leaveGroupService(mockGroupId)
    ).resolves.not.toThrow();
  });

  it("エラー: 削除失敗した場合はErrorを投げる", async () => {
    mockedCheck.mockResolvedValue({ success: true, userId: mockUserId });
    mockedDeleteUserToGroupQuery.mockResolvedValue([]);

    await expect(
      userService.leaveGroupService(mockGroupId)
    ).rejects.toThrowError();
  });

  it("正常: グループ内プロフィール取得", async () => {
    mockedCheck.mockResolvedValue({ success: true, userId: mockUserId });
    mockedFindGroupUserProfileQuery.mockResolvedValue([
      {
        ...mockUserProfiles[0],
        roleId: mockAdminRoleId,
        groupId: mockGroupId,
      },
    ]);

    const result = await userService.getGroupUserProfileService(mockGroupId);
    expect(result.groupProfile.userId).toBe(mockUserId);
  });

  it("エラー: プロフィールが無い場合はNotFoundErrorを投げる", async () => {
    mockedCheck.mockResolvedValue({ success: true, userId: mockUserId });
    mockedFindGroupUserProfileQuery.mockResolvedValue([]);

    await expect(
      userService.getGroupUserProfileService(mockGroupId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("正常: 自分のプロフィール取得", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedFindUserProfileQuery.mockResolvedValue(mockUserProfiles);

    const result = await userService.getUserProfileService();
    expect(result.profile.userId).toBe(mockUserId);
  });

  it("エラー: プロフィールが無い場合はNotFoundErrorを投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockUserId);
    mockedFindUserProfileQuery.mockResolvedValue([]);

    await expect(userService.getUserProfileService()).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});

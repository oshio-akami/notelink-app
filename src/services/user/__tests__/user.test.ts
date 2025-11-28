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
  insertAdminToGroupQuery: vi.fn(),
  insertMemberToGroupQuery: vi.fn(),
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

import {
  insertAdminToGroupQuery,
  insertMemberToGroupQuery,
} from "@/db/queries/group";

import { withGroupMemberCheck } from "@/services/withGroupMemberCheck";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";
import {
  MOCK_DATE,
  MOCK_GROUP_ID,
  MOCK_USER_ID,
} from "@/tests/__mocks__/testData";

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
const mockedInsertAdmin = vi.mocked(insertAdminToGroupQuery);
const mockedInsertMember = vi.mocked(insertMemberToGroupQuery);
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

const mockAdminRoleId = 1;
const mockUserRoleId = 2;
const mockUserProfiles: UserProfile[] = [
  {
    userId: MOCK_USER_ID,
    displayName: "Test Name",
    image: "Test Image",
    about: "Test About",
    currentGroupId: MOCK_GROUP_ID,
  },
];
const mockGroupSummaries: GroupSummary[] = [
  {
    groupId: MOCK_GROUP_ID,
    groupName: "Test Group",
    postCount: 3,
    lastPostAt: MOCK_DATE(),
    memberCount: 2,
  },
];

describe("User Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedGetSessionUserId.mockResolvedValue(MOCK_USER_ID);
  });

  describe("hasJoinedGroupService", () => {
    it("正常: 参加済みチェック", async () => {
      mockedHasJoinedQuery.mockResolvedValue([
        {
          userId: MOCK_USER_ID,
          groupId: MOCK_GROUP_ID,
          roleId: mockAdminRoleId,
        },
      ]);

      const result = await userService.hasJoinedGroupService(MOCK_GROUP_ID);
      expect(result.hasJoinedGroup).toBe(true);
    });

    it("エラー: 未ログインの場合はUnauthorizedErrorを投げる", async () => {
      mockedGetSessionUserId.mockResolvedValue(undefined);

      await expect(
        userService.hasJoinedGroupService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });
  });
  describe("joinGroupService", () => {
    it("正常: ロールがAdminの場合insertAdminToGroup", async () => {
      mockedInsertAdmin.mockResolvedValue([
        {
          userId: MOCK_USER_ID,
          groupId: MOCK_GROUP_ID,
          roleId: mockAdminRoleId,
        },
      ]);

      const result = await userService.joinGroupService(
        MOCK_GROUP_ID,
        mockAdminRoleId
      );

      expect(mockedInsertAdmin).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_GROUP_ID
      );
      expect(result.joinedGroup.groupId).toBe(MOCK_GROUP_ID);
    });

    it("正常: ロールがUserの場合insertMemberToGroup", async () => {
      mockedInsertMember.mockResolvedValue([
        {
          userId: MOCK_USER_ID,
          groupId: MOCK_GROUP_ID,
          roleId: mockUserRoleId,
        },
      ]);

      const result = await userService.joinGroupService(
        MOCK_GROUP_ID,
        mockUserRoleId
      );

      expect(mockedInsertMember).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_GROUP_ID
      );
      expect(result.joinedGroup.groupId).toBe(MOCK_GROUP_ID);
    });

    it("エラー: 未ログインの場合はUnauthorizedErrorを投げる", async () => {
      mockedGetSessionUserId.mockResolvedValue(undefined);

      await expect(
        userService.joinGroupService(MOCK_GROUP_ID, mockAdminRoleId)
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });
  });
  describe("setCurrentGroupService", () => {
    it("正常: currentGroupの更新", async () => {
      mockedUpdateCurrentGroupQuery.mockResolvedValue(mockUserProfiles);

      const result = await userService.setCurrentGroupService(MOCK_GROUP_ID);
      expect(result.success).toBe(true);
    });

    it("エラー: 更新失敗した場合はErrorを投げる", async () => {
      mockedUpdateCurrentGroupQuery.mockResolvedValue([]);

      await expect(
        userService.setCurrentGroupService(MOCK_GROUP_ID)
      ).rejects.toThrowError();
    });
  });
  describe("getCurrentGroupService", () => {
    it("正常: プロフィールにcurrentGroupがある", async () => {
      mockedFindUserProfileQuery.mockResolvedValue(mockUserProfiles);

      const result = await userService.getCurrentGroupService();
      expect(result.currentGroupId).toBe(MOCK_GROUP_ID);
    });

    it("正常: currentGroupが無い場合groupsの1件目を採用", async () => {
      mockedFindUserProfileQuery.mockResolvedValue([]);
      mockedFindGroupsQuery.mockResolvedValue([
        { groupId: MOCK_GROUP_ID, groupName: "Test Group" },
      ]);
      mockedUpdateCurrentGroupQuery.mockResolvedValue(mockUserProfiles);

      const result = await userService.getCurrentGroupService();
      expect(result.currentGroupId).toBe(MOCK_GROUP_ID);
    });

    it("エラー: groupsが0件の場合はNotFoundErrorを投げる", async () => {
      mockedFindUserProfileQuery.mockResolvedValue([]);
      mockedFindGroupsQuery.mockResolvedValue([]);

      await expect(userService.getCurrentGroupService()).rejects.toBeInstanceOf(
        NotFoundError
      );
    });
  });
  describe("getGroupsService", () => {
    it("正常: 所属グループ取得", async () => {
      mockedFindGroupsQuery.mockResolvedValue([
        { groupId: MOCK_GROUP_ID, groupName: "Test Group" },
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
  });
  describe("getGroupSummariesService", () => {
    it("正常: グループサマリ取得", async () => {
      mockedFindSummariesQuery.mockResolvedValue(mockGroupSummaries);

      const result = await userService.getGroupSummariesService();
      expect(result.groupSummaries.length).toBe(1);
    });
  });
  describe("leaveGroupService", () => {
    it("正常: グループ退出", async () => {
      mockedCheck.mockResolvedValue({ success: true, userId: MOCK_USER_ID });
      mockedDeleteUserToGroupQuery.mockResolvedValue([
        {
          userId: MOCK_USER_ID,
          groupId: MOCK_GROUP_ID,
          roleId: mockAdminRoleId,
        },
      ]);

      await expect(
        userService.leaveGroupService(MOCK_GROUP_ID)
      ).resolves.not.toThrow();
    });

    it("エラー: 削除失敗した場合はErrorを投げる", async () => {
      mockedCheck.mockResolvedValue({ success: true, userId: MOCK_USER_ID });
      mockedDeleteUserToGroupQuery.mockResolvedValue([]);

      await expect(
        userService.leaveGroupService(MOCK_GROUP_ID)
      ).rejects.toThrowError();
    });
  });
  describe("getGroupUserProfileService", () => {
    it("正常: グループ内プロフィール取得", async () => {
      mockedCheck.mockResolvedValue({ success: true, userId: MOCK_USER_ID });
      mockedFindGroupUserProfileQuery.mockResolvedValue([
        {
          ...mockUserProfiles[0],
          roleId: mockAdminRoleId,
          groupId: MOCK_GROUP_ID,
        },
      ]);

      const result = await userService.getGroupUserProfileService(
        MOCK_GROUP_ID
      );
      expect(result.groupProfile.userId).toBe(MOCK_USER_ID);
    });

    it("エラー: プロフィールが無い場合はNotFoundErrorを投げる", async () => {
      mockedCheck.mockResolvedValue({ success: true, userId: MOCK_USER_ID });
      mockedFindGroupUserProfileQuery.mockResolvedValue([]);

      await expect(
        userService.getGroupUserProfileService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("getUserProfileService", () => {
    it("正常: 自分のプロフィール取得", async () => {
      mockedFindUserProfileQuery.mockResolvedValue(mockUserProfiles);

      const result = await userService.getUserProfileService();
      expect(result.profile.userId).toBe(MOCK_USER_ID);
    });

    it("エラー: プロフィールが無い場合はNotFoundErrorを投げる", async () => {
      mockedFindUserProfileQuery.mockResolvedValue([]);

      await expect(userService.getUserProfileService()).rejects.toBeInstanceOf(
        NotFoundError
      );
    });
  });
});

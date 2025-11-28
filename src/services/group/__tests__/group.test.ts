import { vi } from "vitest";

vi.mock("@/db/queries/group", () => ({
  findGroupMembersQuery: vi.fn(),
  findGroupQuery: vi.fn(),
  insertGroupQuery: vi.fn(),
  insertAdminToGroupQuery: vi.fn(),
  findUserRoleIdQuery: vi.fn(),
  deleteMemberToGroupQuery: vi.fn(),
}));

vi.mock("@/services/withGroupMemberCheck", () => ({
  withGroupMemberCheck: vi.fn(),
}));

vi.mock("@/libs/getSessionUserId", () => ({
  getSessionUserId: vi.fn(),
}));

import { describe, it, expect, beforeEach } from "vitest";
import * as groupService from "@/services/group/group";
import { ForbiddenError, NotFoundError } from "@/utils/errors";

import * as groupQuery from "@/db/queries/group";

import { withGroupMemberCheck } from "@/services/withGroupMemberCheck";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { MOCK_GROUP_ID, MOCK_USER_ID } from "@/tests/__mocks__/testData";

const mockedWithGroupMemberCheck = vi.mocked(withGroupMemberCheck);
const mockedGetSessionUserId = vi.mocked(getSessionUserId);
const mockedFindGroupMembersQuery = vi.mocked(groupQuery.findGroupMembersQuery);
const mockedInsertGroupQuery = vi.mocked(groupQuery.insertGroupQuery);
const mockedInsertAdminToGroupQuery = vi.mocked(
  groupQuery.insertAdminToGroupQuery
);
const mockedFindUserRoleIdQuery = vi.mocked(groupQuery.findUserRoleIdQuery);
const mockedDeleteMemberToGroupQuery = vi.mocked(
  groupQuery.deleteMemberToGroupQuery
);

describe("Group Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: MOCK_USER_ID,
    });
  });
  describe("getGroupMembersService", () => {
    it("正常: メンバー一覧の取得", async () => {
      mockedFindGroupMembersQuery.mockResolvedValue([
        {
          userId: MOCK_USER_ID,
          displayName: "Test Name",
          image: "Test Image",
          role: "member",
        },
      ]);
      const result = await groupService.getGroupMembersService(MOCK_GROUP_ID);
      expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(MOCK_GROUP_ID);
      expect(mockedFindGroupMembersQuery).toHaveBeenCalledWith(MOCK_GROUP_ID);
      expect(result.members[0].userId).toBe(MOCK_USER_ID);
    });

    it("エラー: ユーザー認証失敗で ForbiddenError", async () => {
      mockedWithGroupMemberCheck.mockRejectedValue(new ForbiddenError());
      await expect(
        groupService.getGroupMembersService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(ForbiddenError);
    });

    it("エラー: メンバーが存在しない場合は NotFoundError", async () => {
      mockedFindGroupMembersQuery.mockResolvedValue([]);
      await expect(
        groupService.getGroupMembersService(MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("createGroupService", () => {
    it("正常: グループ作成と管理者追加", async () => {
      mockedGetSessionUserId.mockResolvedValue(MOCK_USER_ID);
      mockedInsertGroupQuery.mockResolvedValue({
        groupId: MOCK_GROUP_ID,
        groupName: "Test Group",
      });
      mockedInsertAdminToGroupQuery.mockResolvedValue([
        { groupId: MOCK_GROUP_ID, userId: MOCK_USER_ID, roleId: 1 },
      ]);

      const result = await groupService.createGroupService("test group");
      expect(result.createdGroup.groupId).toBe(MOCK_GROUP_ID);
    });

    it("エラー: ユーザーID取得失敗で ForbiddenError", async () => {
      mockedGetSessionUserId.mockResolvedValue(undefined);
      await expect(
        groupService.createGroupService("Test Group")
      ).rejects.toBeInstanceOf(ForbiddenError);
    });

    it("エラー: グループ作成失敗で NotFoundError", async () => {
      mockedGetSessionUserId.mockResolvedValue(MOCK_USER_ID);
      mockedInsertGroupQuery.mockResolvedValue(null);
      await expect(
        groupService.createGroupService("Test Group")
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("deleteMembersService", () => {
    it("正常: メンバー削除", async () => {
      mockedFindUserRoleIdQuery.mockResolvedValue([{ roleId: 1 }]);
      mockedDeleteMemberToGroupQuery.mockResolvedValue({
        rowCount: 1,
        rows: [],
        fields: [],
        command: "DELETE",
        rowAsArray: false,
      });
      const result = await groupService.deleteMembersService(
        MOCK_USER_ID,
        MOCK_GROUP_ID
      );
      expect(result.success).toBe(true);
    });

    it("エラー: ユーザー認証失敗で ForbiddenError", async () => {
      mockedWithGroupMemberCheck.mockRejectedValue(new ForbiddenError());
      await expect(
        groupService.deleteMembersService(MOCK_USER_ID, MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(ForbiddenError);
    });

    it("エラー: 権限取得失敗で NotFoundError", async () => {
      mockedFindUserRoleIdQuery.mockResolvedValue([]);
      await expect(
        groupService.deleteMembersService(MOCK_USER_ID, MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("エラー: admin 権限がない場合は ForbiddenError", async () => {
      mockedFindUserRoleIdQuery.mockResolvedValue([{ roleId: 2 }]);
      await expect(
        groupService.deleteMembersService(MOCK_USER_ID, MOCK_GROUP_ID)
      ).rejects.toBeInstanceOf(ForbiddenError);
    });
  });
});

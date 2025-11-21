import { vi } from "vitest";

vi.mock("@/db/queries/group", () => ({
  findGroupMembers: vi.fn(),
  findGroup: vi.fn(),
  insertGroup: vi.fn(),
  insertAdminToGroup: vi.fn(),
  findUserRoleId: vi.fn(),
  deleteMemberToGroup: vi.fn(),
}));

vi.mock("@/libs/apiUtils", () => ({
  withGroupMemberCheck: vi.fn(),
}));

vi.mock("@/libs/getSessionUserId", () => ({
  getSessionUserId: vi.fn(),
}));

vi.mock("@/libs/roleUtils", () => ({
  ROLE_ADMIN: 1,
}));

import { describe, it, expect, beforeEach } from "vitest";
import * as groupService from "@/services/group/group";
import { ForbiddenError, NotFoundError } from "@/utils/errors";

import {
  findGroupMembers,
  insertGroup,
  insertAdminToGroup,
  findUserRoleId,
  deleteMemberToGroup,
} from "@/db/queries/group";

import { withGroupMemberCheck } from "@/libs/apiUtils";
import { getSessionUserId } from "@/libs/getSessionUserId";

const mockedWithGroupMemberCheck = vi.mocked(withGroupMemberCheck);
const mockedFindGroupMembers = vi.mocked(findGroupMembers);
const mockedGetSessionUserId = vi.mocked(getSessionUserId);
const mockedInsertGroup = vi.mocked(insertGroup);
const mockedInsertAdminToGroup = vi.mocked(insertAdminToGroup);
const mockedFindUserRoleId = vi.mocked(findUserRoleId);
const mockedDeleteMemberToGroup = vi.mocked(deleteMemberToGroup);

describe("Group Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockGroupId = "11111111-1111-1111-1111-111111111111";
  const mockAdminUserId = "22222222-2222-2222-2222-222222222222";
  const mockMemberUserId = "33333333-3333-3333-3333-333333333333";

  it("正常: メンバー一覧の取得", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockAdminUserId,
    });
    mockedFindGroupMembers.mockResolvedValue([
      {
        userId: mockAdminUserId,
        displayName: "test display name",
        image: "testImage.png",
        role: "member",
      },
    ]);
    const result = await groupService.getGroupMembersService(mockGroupId);
    expect(mockedWithGroupMemberCheck).toHaveBeenCalledWith(mockGroupId);
    expect(mockedFindGroupMembers).toHaveBeenCalledWith(mockGroupId);
    expect(result.members).toHaveLength(1);
    expect(result.members[0].userId).toBe(mockAdminUserId);
  });
  it("エラー: メンバー一覧の取得、ユーザー認証が失敗した場合はForbiddenErrorを投げる", async () => {
    mockedWithGroupMemberCheck.mockRejectedValue(new ForbiddenError());
    await expect(
      groupService.getGroupMembersService(mockGroupId)
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("エラー: メンバー一覧の取得、メンバーが存在しない場合はNotFoundErrorを投げる", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockAdminUserId,
    });
    mockedFindGroupMembers.mockResolvedValue([]);
    await expect(
      groupService.getGroupMembersService(mockGroupId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("正常: グループ作成と管理者追加", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockAdminUserId);
    mockedInsertGroup.mockResolvedValue({
      groupId: mockGroupId,
      groupName: "test group",
    });
    mockedInsertAdminToGroup.mockResolvedValue({
      userId: mockAdminUserId,
      groupId: mockGroupId,
      roleId: 1,
    });
    const result = await groupService.createGroupService("test group");
    expect(mockedGetSessionUserId).toHaveBeenCalled();
    expect(mockedInsertGroup).toHaveBeenCalledWith("test group");
    expect(mockedInsertAdminToGroup).toHaveBeenCalledWith(
      mockAdminUserId,
      mockGroupId
    );
    expect(result.createdGroup.groupId).toBe(mockGroupId);
  });

  it("エラー: グループ作成と管理者追加 ユーザーIDの取得に失敗した安倍はForbiddenErrorを投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(undefined);
    await expect(
      groupService.createGroupService(mockGroupId)
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(mockedGetSessionUserId).toHaveBeenCalled();
  });

  it("エラー: グループ作成と管理者追加 グループ作成の失敗した場合はNotFoundErrorを投げる", async () => {
    mockedGetSessionUserId.mockResolvedValue(mockAdminUserId);
    mockedInsertGroup.mockResolvedValue(null);
    await expect(
      groupService.createGroupService("テストグループ")
    ).rejects.toThrow(NotFoundError);
    expect(mockedGetSessionUserId).toHaveBeenCalled();
    expect(mockedInsertGroup).toHaveBeenCalled();
  });

  it("正常: メンバーの削除", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockAdminUserId,
    });
    mockedFindUserRoleId.mockResolvedValue({ roleId: 1 });
    mockedDeleteMemberToGroup.mockResolvedValue({
      rowCount: 1,
      rows: [],
      fields: [],
      command: "DELETE",
      rowAsArray: false,
    });
    const result = await groupService.deleteMembersService(
      mockMemberUserId,
      mockGroupId
    );
    expect(result.success).toBe(true);
  });

  it("エラー: メンバーの削除 ユーザーIDの取得に失敗した場合はForbiddenErrorを投げる", async () => {
    mockedWithGroupMemberCheck.mockRejectedValue(new ForbiddenError());
    await expect(
      groupService.deleteMembersService(mockAdminUserId, mockGroupId)
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("エラー: メンバーの削除 権限の取得に失敗した場合はNotFoundErrorを投げる", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockAdminUserId,
    });
    mockedFindUserRoleId.mockResolvedValue(null);
    await expect(
      groupService.deleteMembersService(mockAdminUserId, mockGroupId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("エラー: メンバーの削除 admin権限を持たない場合はForbiddenErrorを投げる", async () => {
    mockedWithGroupMemberCheck.mockResolvedValue({
      success: true,
      userId: mockMemberUserId,
    });
    mockedFindUserRoleId.mockResolvedValue({ roleId: 2 });

    await expect(
      groupService.deleteMembersService(mockMemberUserId, mockGroupId)
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

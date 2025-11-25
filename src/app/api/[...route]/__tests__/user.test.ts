import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/services/user/user", () => ({
  getCurrentGroupService: vi.fn(),
  getGroupsService: vi.fn(),
  getGroupSummariesService: vi.fn(),
  getGroupUserProfileService: vi.fn(),
  getUserProfileByIdService: vi.fn(),
  getUserProfileService: vi.fn(),
  hasJoinedGroupService: vi.fn(),
  joinGroupService: vi.fn(),
  leaveGroupService: vi.fn(),
  setCurrentGroupService: vi.fn(),
}));

import user from "../user";

import {
  getCurrentGroupService,
  getGroupsService,
  getGroupSummariesService,
  getGroupUserProfileService,
  getUserProfileService,
  hasJoinedGroupService,
  joinGroupService,
  leaveGroupService,
  setCurrentGroupService,
} from "@/services/user/user";

const mockedGetCurrentGroupService = vi.mocked(getCurrentGroupService);
const mockedGetGroupsService = vi.mocked(getGroupsService);
const mockedGetGroupSummariesService = vi.mocked(getGroupSummariesService);
const mockedGetGroupUserProfileService = vi.mocked(getGroupUserProfileService);
const mockedGetUserProfileService = vi.mocked(getUserProfileService);
const mockedHasJoinedGroupService = vi.mocked(hasJoinedGroupService);
const mockedJoinGroupService = vi.mocked(joinGroupService);
const mockedLeaveGroupService = vi.mocked(leaveGroupService);
const mockedSetCurrentGroupService = vi.mocked(setCurrentGroupService);

type GroupSummary = {
  groupId: string;
  groupName: string;
  postCount: number;
  lastPostAt: Date | null;
  memberCount: number;
};

type GroupUserProfile = {
  userId: string;
  image: string;
  displayName: string;
  roleId: number;
  groupId: string;
};

type UserProfile = {
  userId: string;
  displayName: string;
  image: string;
  about: string;
  currentGroupId: string | null;
};

const TEST_DATE = new Date("2025-01-01T00:00:00.000Z");

describe("ユーザーAPIのRoute", () => {
  const mockGroupId = "11111111-1111-1111-1111-111111111111";
  const mockUserId = "22222222-2222-2222-2222-222222222222";
  const mockAdminId = 1;

  const mockGroupSummaries: GroupSummary[] = [
    {
      groupId: mockGroupId,
      groupName: "Test Group",
      postCount: 3,
      lastPostAt: TEST_DATE,
      memberCount: 5,
    },
  ];

  const mockGroupUserProfile: GroupUserProfile = {
    userId: mockUserId,
    image: "Test Image",
    displayName: "Test Name",
    roleId: mockAdminId,
    groupId: mockGroupId,
  };

  const mockUserProfile: UserProfile = {
    userId: mockUserId,
    displayName: "Test Name",
    image: "Test Image",
    about: "Test About",
    currentGroupId: mockGroupId,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /hasJoined/:groupId グループ参加確認", async () => {
    mockedHasJoinedGroupService.mockResolvedValue({ hasJoinedGroup: true });

    const req = new Request(`http://localhost/hasJoined/${mockGroupId}`);
    const res = await user.fetch(req);
    const body = await res.json<{ hasJoinedGroup: boolean }>();

    expect(res.status).toBe(200);
    expect(body.hasJoinedGroup).toBe(true);
  });

  it("POST /join/:groupId グループ参加", async () => {
    mockedJoinGroupService.mockResolvedValue({
      joinedGroup: [
        {
          userId: mockUserId,
          groupId: mockGroupId,
          roleId: mockAdminId,
        },
      ],
    });

    const req = new Request(`http://localhost/join/${mockGroupId}`, {
      method: "POST",
      body: JSON.stringify({ roleId: mockAdminId }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await user.fetch(req);
    const body = await res.json<{
      joinedGroup: {
        userId: string;
        groupId: string;
        roleId: number;
      }[];
    }>();

    expect(res.status).toBe(200);
    expect(body.joinedGroup[0].groupId).toBe(mockGroupId);
  });

  it("PATCH /currentGroup/:groupId 現在のグループを更新", async () => {
    mockedSetCurrentGroupService.mockResolvedValue({ success: true });

    const req = new Request(`http://localhost/currentGroup/${mockGroupId}`, {
      method: "PATCH",
    });
    const res = await user.fetch(req);
    const body = await res.json<{ success: boolean }>();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("GET /currentGroup 現在のグループ取得", async () => {
    mockedGetCurrentGroupService.mockResolvedValue({
      currentGroupId: mockGroupId,
    });

    const req = new Request("http://localhost/currentGroup");
    const res = await user.fetch(req);
    const body = await res.json<{ currentGroup: string | null }>();

    expect(res.status).toBe(200);
    expect(body.currentGroup).toBe(mockGroupId);
  });

  it("GET /groups グループ一覧取得", async () => {
    mockedGetGroupsService.mockResolvedValue({
      groups: [{ groupId: mockGroupId, groupName: "Test Group" }],
    });

    const req = new Request("http://localhost/groups");
    const res = await user.fetch(req);
    const body = await res.json<{
      groups: { groupId: string; groupName: string }[];
    }>();

    expect(res.status).toBe(200);
    expect(body.groups[0].groupId).toBe(mockGroupId);
  });

  it("GET /groups/summary グループ一覧のサマリー取得", async () => {
    mockedGetGroupSummariesService.mockResolvedValue({
      groupSummaries: mockGroupSummaries,
    });

    const req = new Request("http://localhost/groups/summary");
    const res = await user.fetch(req);
    const body = await res.json<{ summaries: GroupSummary[] }>();

    expect(res.status).toBe(200);
    expect(body.summaries[0].groupId).toBe(mockGroupId);
  });

  it("DELETE /:groupId グループ退会", async () => {
    mockedLeaveGroupService.mockResolvedValue();

    const req = new Request(`http://localhost/${mockGroupId}`, {
      method: "DELETE",
    });
    const res = await user.fetch(req);
    const body = await res.json<{ success: boolean }>();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("GET /:groupId/profile グループ内プロフィール取得", async () => {
    mockedGetGroupUserProfileService.mockResolvedValue({
      groupProfile: mockGroupUserProfile,
    });

    const req = new Request(`http://localhost/${mockGroupId}/profile`);
    const res = await user.fetch(req);
    const body = await res.json<{ profile: GroupUserProfile }>();

    expect(res.status).toBe(200);
    expect(body.profile.userId).toBe(mockUserId);
  });

  it("GET /profile 自分のプロフィール取得", async () => {
    mockedGetUserProfileService.mockResolvedValue({
      profile: mockUserProfile,
    });

    const req = new Request("http://localhost/profile");
    const res = await user.fetch(req);
    const body = await res.json<{ profile: UserProfile }>();

    expect(res.status).toBe(200);
    expect(body.profile.userId).toBe(mockUserId);
  });
});

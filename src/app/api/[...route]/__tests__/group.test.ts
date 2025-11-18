import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/services/group", () => ({
  getGroupMembersService: vi.fn(),
  createGroupService: vi.fn(),
  getGroupService: vi.fn(),
  deleteMembersService: vi.fn(),
}));

import group from "../group.js";
import * as groupService from "@/services/group";

describe("グループAPIのRoute", () => {
  const mockGroupId = "11111111-1111-1111-1111-111111111111";
  const mockUserId = "22222222-2222-2222-2222-222222222222";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /members/:groupId メンバー一覧の取得", async () => {
    vi.spyOn(groupService, "getGroupMembersService").mockResolvedValue({
      members: [
        {
          userId: mockUserId,
          displayName: "Test User",
          image: "sample image",
          role: "admin",
        },
      ],
    });

    const req = new Request(`http://localhost/members/${mockGroupId}`);
    const res = await group.fetch(req);

    const body = (await res.json()) as {
      members: {
        userId: string;
        displayName: string;
        image: string;
        role: string;
      }[];
    };
    expect(res.status).toBe(200);
    expect(body.members).toHaveLength(1);
    expect(body.members[0].displayName).toBe("Test User");
  });

  it("POST /create グループの作成", async () => {
    vi.spyOn(groupService, "createGroupService").mockResolvedValue({
      createdGroup: { groupId: mockGroupId, groupName: "Test Group" },
    });

    const req = new Request(`http://localhost/create`, {
      method: "POST",
      body: JSON.stringify({ groupName: "Test Group" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await group.fetch(req);
    const body = (await res.json()) as {
      created: {
        groupId: string;
        groupName: string;
      };
    };

    expect(res.status).toBe(200);
    expect(body.created.groupName).toBe("Test Group");
  });

  it("GET /:groupId グループ情報の取得", async () => {
    vi.spyOn(groupService, "getGroupService").mockResolvedValue({
      group: { groupId: mockGroupId, groupName: "Test Group" },
    });

    const req = new Request(`http://localhost/${mockGroupId}`);
    const res = await group.fetch(req);
    const body = (await res.json()) as {
      group: {
        groupId: string;
        groupName: string;
      };
    };

    expect(res.status).toBe(200);
    expect(body.group.groupName).toBe("Test Group");
  });

  it("DELETE /:groupId/user/:userId グループからメンバーを削除", async () => {
    vi.spyOn(groupService, "deleteMembersService").mockResolvedValue({
      success: true,
    });

    const req = new Request(
      `http://localhost/${mockGroupId}/user/${mockUserId}`,
      {
        method: "DELETE",
      }
    );

    const res = await group.fetch(req);
    const body = (await res.json()) as { success: boolean };

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });
});

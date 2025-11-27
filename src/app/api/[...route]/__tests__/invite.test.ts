import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/services/invite/invite", () => ({
  validateTokenService: vi.fn(),
  createInviteTokenService: vi.fn(),
  getInviteTokenService: vi.fn(),
}));

import invite from "../invite";
import * as inviteService from "@/services/invite/invite";

const mockedValidateTokenService = vi.mocked(
  inviteService.validateTokenService
);
const mockedCreateInviteTokenService = vi.mocked(
  inviteService.createInviteTokenService
);
const mockedGetInviteTokenService = vi.mocked(
  inviteService.getInviteTokenService
);

describe("招待APIのRoute", () => {
  const mockTokenId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
  const mockGroupId = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET /validate/:token トークンが有効か確認", async () => {
    mockedValidateTokenService.mockResolvedValue({
      groupId: mockGroupId,
    });

    const req = new Request(`http://localhost/validate/${mockTokenId}`);
    const res = await invite.fetch(req);
    const body = await res.json<{ success: boolean; message: string }>();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe(mockGroupId);
  });

  it("POST /token/:groupId 招待トークンの作成", async () => {
    mockedCreateInviteTokenService.mockResolvedValue({
      token: mockTokenId,
    });

    const req = new Request(`http://localhost/token/${mockGroupId}`, {
      method: "POST",
    });
    const res = await invite.fetch(req);
    const body = await res.json<{ token: string }>();

    expect(res.status).toBe(200);
    expect(body.token).toBe(mockTokenId);
  });

  it("GET /token/:groupId グループIDから招待トークンを取得", async () => {
    mockedGetInviteTokenService.mockResolvedValue({
      token: mockTokenId,
    });

    const req = new Request(`http://localhost/token/${mockGroupId}`);
    const res = await invite.fetch(req);
    const body = await res.json<{ token: string }>();

    expect(res.status).toBe(200);
    expect(body.token).toBe(mockTokenId);
  });
});

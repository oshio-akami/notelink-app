import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { handleApiError } from "@/libs/handleApiError";
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

export const runtime = "edge";

const groupIdParamsSchema = z.object({
  groupId: z.string().uuid(),
});

const user = new Hono()
  /**グループに参加しているか確認するAPI */
  .get(
    "/hasJoined/:groupId",
    zValidator("param", groupIdParamsSchema),
    async (c) => {
      try {
        const { groupId } = c.req.valid("param");
        await hasJoinedGroupService(groupId);
        return c.json({ hasJoinedGroup: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { hasJoinedGroup: false });
      }
    }
  )
  /**グループに参加するAPI */
  .post(
    "/join/:groupId",
    zValidator(
      "json",
      z.object({
        roleId: z.number().default(2),
      })
    ),
    zValidator("param", groupIdParamsSchema),
    async (c) => {
      try {
        const { groupId } = c.req.valid("param");
        const { roleId } = c.req.valid("json");
        const result = await joinGroupService(groupId, roleId);
        return c.json({ joinedGroup: result.joinedGroup }, 200);
      } catch (error) {
        return handleApiError(c, error, { joinedGroup: null });
      }
    }
  )
  /**現在のグループを更新するAPI */
  .patch(
    "/currentGroup/:groupId",
    zValidator("param", groupIdParamsSchema),
    async (c) => {
      try {
        const { groupId } = c.req.valid("param");
        await setCurrentGroupService(groupId);
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { success: false });
      }
    }
  )
  .get("/currentGroup", async (c) => {
    try {
      const result = await getCurrentGroupService();
      return c.json({ currentGroup: result.currentGroupId }, 200);
    } catch (error) {
      return handleApiError(c, error, { currentGroup: null });
    }
  })
  /**グループ一覧を取得するAPI */
  .get("/groups", async (c) => {
    try {
      const result = await getGroupsService();
      return c.json({ groups: result.groups }, 200);
    } catch (error) {
      return handleApiError(c, error, { groups: null });
    }
  })
  /**グループ一覧のサマリー */
  .get("/groups/summary", async (c) => {
    try {
      const result = await getGroupSummariesService();
      return c.json({ summaries: result.groupSummaries }, 200);
    } catch (error) {
      console.log(error);
      return handleApiError(c, error, { summaries: null });
    }
  })
  /**グループを退会するAPI */
  .delete("/:groupId", zValidator("param", groupIdParamsSchema), async (c) => {
    try {
      const { groupId } = await c.req.valid("param");
      await leaveGroupService(groupId);
      return c.json({ success: true }, 200);
    } catch (error) {
      return handleApiError(c, error, { success: false });
    }
  })
  /** グループ内でのユーザープロフィール取得*/
  .get(
    "/:groupId/profile",
    zValidator("param", groupIdParamsSchema),
    async (c) => {
      try {
        const { groupId } = await c.req.valid("param");
        const result = await getGroupUserProfileService(groupId);
        return c.json({ profile: result.groupProfile }, 200);
      } catch (error) {
        return handleApiError(c, error, { profile: null });
      }
    }
  )
  .get("/profile", async (c) => {
    try {
      const result = await getUserProfileService();
      return c.json({ profile: result.profile }, 200);
    } catch (error) {
      return handleApiError(c, error, { profile: null });
    }
  });

export default user;

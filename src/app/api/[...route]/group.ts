import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { handleApiError } from "@/libs/handleApiError";
import {
  createGroupService,
  deleteMembersService,
  getGroupMembersService,
  getGroupService,
} from "@/services/group/group";

export const runtime = "edge";

const groupParamsSchema = z.object({
  groupId: z.string().uuid(),
  userId: z.string().uuid(),
});

const groupIdParamsSchema = z.object({
  groupId: z.string().uuid(),
});

const groupNameParamsSchema = z.object({
  groupName: z.string(),
});

const group = new Hono()
  /**グループのメンバー一覧を取得するAPI */
  .get(
    "/members/:groupId",
    zValidator("param", groupIdParamsSchema),
    async (c) => {
      try {
        const { groupId } = await c.req.valid("param");
        const result = await getGroupMembersService(groupId);
        return c.json({ members: result.members }, 200);
      } catch (error) {
        return handleApiError(c, error, { members: null });
      }
    }
  )
  /**グループを作成するAPI */
  .post("/create", zValidator("json", groupNameParamsSchema), async (c) => {
    try {
      const { groupName } = await c.req.valid("json");
      const result = await createGroupService(groupName);
      return c.json({ created: result.createdGroup }, 200);
    } catch (error) {
      return handleApiError(c, error, { created: null });
    }
  })
  /**グループの情報を取得するAPI */
  .get("/:groupId", zValidator("param", groupIdParamsSchema), async (c) => {
    try {
      const { groupId } = c.req.valid("param");
      const result = await getGroupService(groupId);
      return c.json({ group: result.group }, 200);
    } catch (error) {
      return handleApiError(c, error, { group: null });
    }
  })
  /**グループ名を取得するAPI */
  .get(
    "/:groupId/name",
    zValidator("param", groupIdParamsSchema),
    async (c) => {
      try {
        const { groupId } = c.req.valid("param");
        const result = await getGroupService(groupId);
        return c.json({ groupName: result.group.groupName }, 200);
      } catch (error) {
        return handleApiError(c, error, { groupName: null });
      }
    }
  ) /**グループからメンバーを削除するAPI */
  .delete(
    "/:groupId/user/:userId",
    zValidator("param", groupParamsSchema),
    async (c) => {
      try {
        const body = await c.req.valid("param");
        const { groupId, userId } = body;
        await deleteMembersService(userId, groupId);
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { success: false });
      }
    }
  );

export default group;

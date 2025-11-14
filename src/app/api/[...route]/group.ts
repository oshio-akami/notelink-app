import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getClient } from "@/libs/hono";
import { z } from "zod";
import { handleApiError } from "@/libs/handleApiError";
import { hasJoinedGroup, withGroupMemberCheck } from "@/libs/apiUtils";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { ROLE_ADMIN } from "@/libs/roleUtils";
import {
  addAdminToGroup,
  createGroup,
  deleteMemberToGroup,
  findGroupById,
  findGroupMembersById,
  findUserRoleId,
} from "@/db/queries/group";

export const runtime = "edge";

const group = new Hono()
  /**グループのメンバー一覧を取得するAPI */
  .get(
    "/members/:groupId",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId } = await c.req.valid("param");
        const client = await getClient();
        const hasJoined = await client.api.user.hasJoined[":groupId"].$get({
          param: { groupId: groupId },
        });
        if (!hasJoined) {
          return c.json({ members: null }, 403);
        }
        const members = await findGroupMembersById(groupId);
        return c.json({ members: members }, 200);
      } catch (error) {
        return handleApiError(c, error, { members: null });
      }
    }
  )
  /**グループを作成するAPI */
  .post(
    "/create",
    zValidator(
      "json",
      z.object({
        groupName: z.string(),
      })
    ),
    async (c) => {
      try {
        const { groupName } = await c.req.valid("json");
        const createdGroup = await createGroup(groupName);
        if (!createdGroup) {
          return c.json({ created: null }, 404);
        }
        const userId = await getSessionUserId();
        if (!userId) {
          return c.json({ created: null }, 401);
        }
        await addAdminToGroup(userId, createdGroup.groupId);
        return c.json({ created: createdGroup }, 200);
      } catch (error) {
        return handleApiError(c, error, { created: null });
      }
    }
  )
  /**グループの情報を取得するAPI */
  .get(
    "/:groupId",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId } = c.req.valid("param");
        const hasJoined = await hasJoinedGroup(groupId);
        if (!hasJoined) {
          return c.json({ group: null }, 403);
        }
        const group = await findGroupById(groupId);
        if (!group) {
          return c.json({ group: null }, 404);
        }
        return c.json({ group: group }, 200);
      } catch (error) {
        return handleApiError(c, error, { group: null });
      }
    }
  )
  .get(
    "/:groupId/name",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId } = c.req.valid("param");
        const group = await findGroupById(groupId);
        if (!group.groupName) {
          return c.json({ groupName: null }, 404);
        }
        return c.json({ groupName: group.groupName }, 200);
      } catch (error) {
        return handleApiError(c, error, { groupName: null });
      }
    }
  ) /**グループからメンバーを削除するAPI */
  .delete(
    "/:groupId/user/:userId",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
        userId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const body = await c.req.valid("param");
        const { groupId, userId } = body;
        //ユーザの役職取得
        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ success: false }, check.status);
        }
        const role = await findUserRoleId(check.userId, groupId);
        if (!role.roleId) {
          return c.json({ success: false }, 404);
        }
        //役職がadminの場合のみ削除
        if (role.roleId !== ROLE_ADMIN) {
          return c.json({ success: false }, 401);
        }

        const deleted = await deleteMemberToGroup(userId, groupId);
        const success = deleted.rowCount > 0;
        if (!success) {
          return c.json({ success: false }, 404);
        }
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { success: false });
      }
    }
  );

export default group;

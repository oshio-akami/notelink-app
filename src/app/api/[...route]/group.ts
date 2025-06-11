import { Hono } from "hono";
import { db } from "@/db/index";
import { zValidator } from "@hono/zod-validator";
import { groupMembers, roles, groups, userProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getClient } from "@/libs/hono";
import { z } from "zod";
import { handleApiError } from "@/libs/handleApiError";
import { hasJoinedGroup, withGroupMemberCheck } from "@/libs/apiUtils";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { ROLE_ADMIN } from "@/libs/roleUtils";

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
        const members = await db
          .select({
            userId: groupMembers.userId,
            displayName: userProfiles.displayName,
            image: userProfiles.image,
            role: roles.roleName,
          })
          .from(groupMembers)
          .innerJoin(userProfiles, eq(groupMembers.userId, userProfiles.userId))
          .innerJoin(roles, eq(groupMembers.roleId, roles.roleId))
          .where(eq(groupMembers.groupId, groupId))
          .orderBy(groupMembers.roleId);
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
        const createdGroup = await db
          .insert(groups)
          .values({
            groupName: groupName,
          })
          .returning();
        if (createdGroup.length === 0) {
          return c.json({ created: null }, 404);
        }
        const userId = await getSessionUserId();
        if (!userId) {
          return c.json({ created: null }, 401);
        }
        await db
          .insert(groupMembers)
          .values({
            userId: userId,
            groupId: createdGroup[0].groupId,
            roleId: 1,
          })
          .returning();
        return c.json({ created: createdGroup[0] }, 200);
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
        const group = await db
          .select()
          .from(groups)
          .where(eq(groups.groupId, groupId))
          .limit(1);
        if (group.length === 0) {
          return c.json({ group: null }, 404);
        }
        return c.json({ group: group[0] }, 404);
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
        const group = await db
          .select({ groupName: groups.groupName })
          .from(groups)
          .where(eq(groups.groupId, groupId))
          .limit(1);
        if (group.length === 0) {
          return c.json({ groupName: null }, 404);
        }
        return c.json({ groupName: group[0].groupName }, 404);
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
        const role = await db
          .select({ roleId: groupMembers.roleId })
          .from(groupMembers)
          .where(
            and(
              eq(groupMembers.userId, check.userId),
              eq(groupMembers.groupId, groupId)
            )
          )
          .limit(1);
        if (role.length === 0) {
          return c.json({ success: false }, 404);
        }
        const roleId = role[0].roleId;
        //役職がadminの場合のみ削除
        if (roleId !== ROLE_ADMIN) {
          return c.json({ success: false }, 401);
        }

        const deleted = await db
          .delete(groupMembers)
          .where(
            and(
              eq(groupMembers.userId, userId),
              eq(groupMembers.groupId, groupId)
            )
          );
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

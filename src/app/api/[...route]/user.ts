import { Hono } from "hono";
import { db } from "@/db/index";
import { groupMembers, userProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { groups } from "@/db/schema";
import { z } from "zod";
import { handleApiError } from "@/libs/handleApiError";
import { getSessionUserId } from "@/libs/getSessionUserId";
import { withGroupMemberCheck } from "@/libs/apiUtils";

export const runtime = "edge";

const user = new Hono()
  /**グループに参加しているか確認するAPI */
  .get(
    "/hasJoined/:groupId",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const userId = await getSessionUserId();
        if (!userId) {
          return c.json({ hasJoinedGroup: false }, 401);
        }
        const { groupId } = c.req.valid("param");
        const result = await db
          .select()
          .from(groupMembers)
          .where(
            and(
              eq(groupMembers.userId, userId),
              eq(groupMembers.groupId, groupId)
            )
          )
          .limit(1);
        return c.json({ hasJoinedGroup: result.length > 0 }, 200);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return c.json({ hasJoinedGroup: false }, 422);
        }
        return c.json({ hasJoinedGroup: false }, 500);
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
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const userId = await getSessionUserId();
        if (!userId) {
          return c.json({ joinedGroup: null }, 401);
        }
        const { groupId } = c.req.valid("param");
        const { roleId } = c.req.valid("json");
        const joinedGroup = await db
          .insert(groupMembers)
          .values({
            userId: userId,
            groupId: groupId,
            roleId: roleId,
          })
          .returning();
        if (joinedGroup.length === 0) {
          return c.json({ joinedGroup: null }, 500);
        }
        return c.json({ joinedGroup: joinedGroup }, 200);
      } catch (error) {
        return handleApiError(c, error, { joinedGroup: null });
      }
    }
  )
  /**現在のグループを更新するAPI */
  .patch(
    "/currentGroup/:groupId",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const userId = await getSessionUserId();
        if (!userId) {
          return c.json({ success: false }, 401);
        }
        const body = c.req.valid("param");
        const { groupId } = body;
        if (!groupId || !userId) {
          return;
        }
        const setCurrentGroup = await db
          .update(userProfiles)
          .set({ currentGroupId: groupId })
          .where(eq(userProfiles.userId, userId));
        if (setCurrentGroup.rowCount === 0) {
          return c.json({ success: false }, 404);
        }
        return c.json({ success: true }, 200);
      } catch (error) {
        return handleApiError(c, error, { success: false });
      }
    }
  )
  .get("/currentGroup", async (c) => {
    try {
      const userId = await getSessionUserId();
      if (!userId) {
        return c.json({ currentGroup: null }, 401);
      }
      const currentGroup = await db
        .select({ currentGroup: userProfiles.currentGroupId })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);
      if (!currentGroup || currentGroup.length === 0) {
        const joinedGroup = await db
          .select()
          .from(groupMembers)
          .where(eq(groupMembers.userId, userId))
          .limit(1);
        if (!joinedGroup || joinedGroup.length === 0) {
          return c.json({ currentGroup: null }, 404);
        }
        await db
          .update(userProfiles)
          .set({ currentGroupId: joinedGroup[0].groupId })
          .where(eq(userProfiles.userId, userId));

        return c.json({ currentGroup: joinedGroup[0].groupId }, 200);
      }
      return c.json({ currentGroup: currentGroup[0].currentGroup }, 200);
    } catch (error) {
      return handleApiError(c, error, { currentGroup: null });
    }
  })
  /**グループ一覧を取得するAPI */
  .get("/groups", async (c) => {
    try {
      const userId = await getSessionUserId();
      if (!userId) {
        return c.json({ groups: null }, 401);
      }
      const groupList = await db
        .select({
          groupId: groups.groupId,
          groupName: groups.groupName,
        })
        .from(groupMembers)
        .innerJoin(groups, eq(groupMembers.groupId, groups.groupId))
        .where(eq(groupMembers.userId, userId));
      return c.json({ groups: groupList }, 200);
    } catch (error) {
      return handleApiError(c, error, { groups: null });
    }
  })
  /**グループを退会するAPI */
  .delete(
    "/:groupId",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const userId = await getSessionUserId();
        if (!userId) {
          return c.json({ deleted: null }, 401);
        }
        const body = await c.req.valid("param");
        const { groupId } = body;
        const deleted = await db
          .delete(groupMembers)
          .where(
            and(
              eq(groupMembers.userId, userId),
              eq(groupMembers.groupId, groupId)
            )
          )
          .returning();
        if (deleted.length === 0) {
          return c.json({ deleted: null }, 404);
        }
        return c.json({ deleted: deleted }, 200);
      } catch (error) {
        return handleApiError(c, error, { deleted: null });
      }
    }
  )
  /** グループ内でのユーザープロフィール取得*/
  .get(
    "/:groupId/profile",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId } = await c.req.valid("param");
        const check = await withGroupMemberCheck(groupId);
        if (!check.success) {
          return c.json({ profile: null }, check.status);
        }
        const profile = await db
          .select({
            userId: userProfiles.userId,
            image: userProfiles.image,
            displayName: userProfiles.displayName,
            roleId: groupMembers.roleId,
            groupId: groupMembers.groupId,
          })
          .from(userProfiles)
          .where(eq(userProfiles.userId, check.userId))
          .innerJoin(
            groupMembers,
            and(
              eq(groupMembers.userId, check.userId),
              eq(groupMembers.groupId, groupId)
            )
          )
          .limit(1);
        if (profile.length === 0) {
          return c.json({ profile: null }, 404);
        }
        return c.json({ profile: profile[0] }, 200);
      } catch (error) {
        return handleApiError(c, error, { profile: null });
      }
    }
  )
  .get("/profile", async (c) => {
    try {
      const userId = await getSessionUserId();
      if (!userId) {
        return c.json({ profile: null }, 401);
      }
      const profile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);
      if (profile.length === 0) {
        return c.json({ profile: null }, 404);
      }
      return c.json({ profile: profile[0] }, 200);
    } catch (error) {
      return handleApiError(c, error, { profile: null });
    }
  })
  .get(
    "profile/",
    zValidator(
      "json",
      z.object({
        userId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { userId } = c.req.valid("json");
        if (!userId) {
          return c.json({ profile: null }, 401);
        }
        const profile = await db
          .select()
          .from(userProfiles)
          .where(eq(userProfiles.userId, userId))
          .limit(1);
        if (profile.length === 0) {
          return c.json({ profile: null }, 404);
        }
        return c.json({ profile: profile[0] }, 200);
      } catch (error) {
        return handleApiError(c, error, { profile: null });
      }
    }
  );

export default user;

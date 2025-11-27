import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { handleApiError } from "@/libs/handleApiError";
import {
  createInviteTokenService,
  getInviteTokenService,
  validateTokenService,
} from "@/services/invite/invite";

export const runtime = "edge";

const invite = new Hono()
  /**トークンが有効かどうか確認するAPI */
  .get(
    "/validate/:token",
    zValidator(
      "param",
      z.object({
        token: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { token } = await c.req.valid("param");
        const result = await validateTokenService(token);
        return c.json({
          success: true,
          message: result.groupId,
        });
      } catch (error) {
        return handleApiError(c, error, { success: false, message: "エラー" });
      }
    }
  )
  /**招待トークンを作成するAPI */
  .post(
    "/token/:groupId",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId } = await c.req.valid("param");
        const result = await createInviteTokenService(groupId);
        return c.json({ token: result.token }, 200);
      } catch (error) {
        return handleApiError(c, error, { token: null });
      }
    }
  )
  /**グループIDから招待トークンを取得するAPI */
  .get(
    "/token/:groupId",
    zValidator(
      "param",
      z.object({
        groupId: z.string().uuid(),
      })
    ),
    async (c) => {
      try {
        const { groupId } = await c.req.valid("param");
        const result = await getInviteTokenService(groupId);
        return c.json({ token: result.token });
      } catch (error) {
        return handleApiError(c, error, { token: null });
      }
    }
  );

export default invite;

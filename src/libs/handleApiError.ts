import { ForbiddenError, NotFoundError } from "@/utils/errors";
import { Context } from "hono";
import { ZodError } from "zod";

type Response = Record<string, unknown>;

export function handleApiError(
  c: Context,
  error: unknown,
  fallback: Response = {}
) {
  if (error instanceof ZodError) {
    return c.json({ ...fallback }, 422);
  }
  if (error instanceof ForbiddenError) {
    return c.json({ ...fallback }, 403);
  }
  if (error instanceof NotFoundError) {
    return c.json({ ...fallback }, 404);
  }
  return c.json({ ...fallback }, 500);
}

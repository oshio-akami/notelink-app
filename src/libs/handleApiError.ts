import { Context } from "hono";
import { ZodError } from "zod";

type Response=Record<string,unknown>

export function handleApiError(c:Context,error:unknown,fallback:Response={}){
  if(error instanceof ZodError){
    return c.json({...fallback},422)
  }
  return c.json({...fallback},500)
}
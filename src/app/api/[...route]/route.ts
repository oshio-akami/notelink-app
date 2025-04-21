import { Hono } from "hono"
import { handle } from "hono/vercel"
import user from "./user"
import invite from "./invite"
import group from "./group"
export const runtime="edge"


const app=new Hono().basePath("/api")


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route=app
  .route("/user",user)
  .route("invite",invite)
  .route("/group",group)


export const GET=handle(app)
export const POST=handle(app)
export type AppType = typeof route
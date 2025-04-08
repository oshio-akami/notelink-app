import { Hono } from "hono";
import { handle } from "hono/vercel";
import posts from "./posts"
import user from "./user"
export const runtime="edge";


const app=new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route=app.route("/posts",posts)
  .route("/users",user);


export const GET=handle(app);
export const POST=handle(app);
export type AppType = typeof route;
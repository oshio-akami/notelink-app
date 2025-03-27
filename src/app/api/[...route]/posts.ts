
import { Hono } from "hono";
//import {db} from "@/db/index";

export const runtime = "edge";

const posts=new Hono()
.get("/", async (c) => {
  return c.json({ name: "Root!" });
});
/*.get("/table", async (c) => {
  const result=await db.select().from(usersTable).execute(); 
  return c.json(result);
});*/


export default posts
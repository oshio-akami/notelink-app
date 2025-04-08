
import { Hono } from "hono";
import {db} from "@/db/index";
import { groups } from "@/db/schema";

export const runtime = "edge";

const project=new Hono()
.get("/", async (c) => {
  return c.json({ name: "Root!" });
})
.get("/projects", async (c) => {
  const result=await db.select().from(groups).execute(); 
  return c.json(result);
});


export default project
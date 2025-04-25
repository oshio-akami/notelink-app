import { hc } from "hono/client";
import type { AppType } from "@/app/api/[...route]/route";
import { headers } from "next/headers";

export const getClient=async()=>{
  const headerList=await headers();
  const cookie=headerList.get("cookie");
  const client=hc<AppType>("http://localhost:3001",{
    init:{
      headers:{
        cookie:cookie??"",
        "content-type":"application/json",
      }
    }
  });
  return client;
}
import { hc } from "hono/client";
import type { AppType } from "@/app/api/[...route]/route";
import { headers } from "next/headers";

export const getClient=async()=>{
  const headerList=await headers();
  const cookie=headerList.get("cookie");
  console.log("pages_url:"+process.env.CF_PAGES_URL);
  console.log("public_url:"+process.env.NEXT_PUBLIC_URL);
  const client=hc<AppType>(process.env.CF_PAGES_URL||process.env.NEXT_PUBLIC_URL!,{
    init:{
      headers:{
        cookie:cookie??"",
        "content-type":"application/json",
      }
    }
  });
  return client;
}
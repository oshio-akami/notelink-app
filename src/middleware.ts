import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {match} from "path-to-regexp"
import client from "./libs/hono";

const hasJoinedGroup=async(id:string,groupId:string)=>{
  const res=await client.api.users.hasJoinedGroup.$post({
      json:{
        userId:id,
        groupId:groupId,
      }
    })
    const body=await res.json();
    return body.hasJoinedGroup;
}
const getJoinedGroups=async(id:string)=>{
    const res=await client.api.users.getJoinedGroups.$post({
      json:{
        userId:id,
     }
    })
    return await res.json();
}
const setCurrentGroup=async(id:string,groupId:string)=>{
  await client.api.users.setCurrentGroup.$post({
      json:{
        userId:id,
        currentGroupId:groupId,
      }
    })
}

export async function middleware(request:NextRequest){
  const session=await auth();
  if(!session?.user?.id){
    const url=request.nextUrl.clone();
    url.pathname="/login";
    return NextResponse.redirect(url);
  }
  const pathname=request.nextUrl.pathname;
  const matcher=match("/group/:id/{*splat}",{decode:decodeURIComponent});
  const matched=matcher(pathname); 
  console.log("matched:"+matched);
  if(matched){
    const {id}=matched.params;
    if(id){
      const groupId=id.toString();
      const hasJoined=await hasJoinedGroup(session.user.id,groupId);
      console.log(hasJoined);
      if(!hasJoined){
        const joinedGroups=await getJoinedGroups(session.user.id);
        const group=joinedGroups[0];
        console.log("group :"+group);
        if(group){
          setCurrentGroup(session.user.id,group.groupId);
          const url=request.nextUrl.clone();
          url.pathname=`/group/${group.groupId}/home`;
          return NextResponse.redirect(url);
        }
        const url=request.nextUrl.clone();
        url.pathname="/join-group"
        return NextResponse.redirect(url);
      }
    }
  }
}


export const config = { 
  matcher: ["/((?!api|_next/static|.*\\..*|_next/image|favicon.ico|login).*)"],
 }
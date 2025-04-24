import { NextRequest, NextResponse } from "next/server"
import {match} from "path-to-regexp"
import {getClient} from "./libs/hono"
import { auth } from "./auth"

const hasJoinedGroup=async(groupId:string)=>{
  const client=await getClient();
  const res=await client.api.user.hasJoined[":groupId"].$get({
      param:{
        groupId:groupId,
      }
    })
    const body=await res.json()
    return body.hasJoinedGroup
}
const getJoinedGroups=async()=>{
  const client=await getClient();
  const res=await client.api.user.groups.$get()
  const body=await res.json()
  return body.groups
}
const setCurrentGroup=async(groupId:string)=>{
  const client=await getClient();
  await client.api.user.currentGroup[":groupId"].$patch({
      param:{
        groupId:groupId,
      }
  })
}

export async function middleware(request:NextRequest){
  const session=await auth();
  const userId=session?.user?.id;
  if(!userId){
    const callbackUrl=request.nextUrl.pathname+request.nextUrl.search;
    const url=request.nextUrl.clone()
    url.pathname="/login"
    url.searchParams.set("callbackUrl",callbackUrl)
    return NextResponse.redirect(url)
  }
  const pathname=request.nextUrl.pathname
  const matcher=match("/group/:id/*splat",{decode:decodeURIComponent})
  const matched=matcher(pathname) 
  if(matched){
    const {id}=matched.params
    if(id){
      const groupId=id.toString()
      const hasJoined=await hasJoinedGroup(groupId)
      if(!hasJoined){
        const joinedGroups=await getJoinedGroups()
        if(joinedGroups){
          setCurrentGroup(joinedGroups[0].groupId)
          const url=request.nextUrl.clone()
          url.pathname=`/group/${joinedGroups[0].groupId}/home`
          return NextResponse.redirect(url)
        }
        const url=request.nextUrl.clone()
        url.pathname="/join-group"
        return NextResponse.redirect(url)
      }
    }
  }
}


export const config = { 
  matcher: ["/((?!api|_next/static|.*\\..*|_next/image|favicon.ico|login).*)"],
 }
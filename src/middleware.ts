import { NextRequest, NextResponse } from "next/server";
import {auth} from "@/auth";

export async function middleware(request:NextRequest){
  const session=await auth();
  if(!session){
    const url=request.nextUrl.clone();
    url.pathname="/login";
    return NextResponse.redirect(url);
  }
  const requestHeaders=new Headers(request.headers);
  requestHeaders.set('x-url',request.url);
  return NextResponse.next({
    request:{
      headers:requestHeaders,
    }
  })
  if(request.nextUrl.pathname.startsWith("/_next")){
    NextResponse.next();
  }
  if(request.nextUrl.pathname!=="/login"){
    const url=request.nextUrl.clone();
    url.pathname="/login";
    return NextResponse.redirect(url);
  }
}


export const config = { 
  matcher: ["/((?!api|_next/static|.*\\..*|_next/image|favicon.ico|login).*)"],
 }
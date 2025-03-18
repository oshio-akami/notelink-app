import { NextRequest, NextResponse } from "next/server";

export function middleware(request:NextRequest){
  return
  if(request.nextUrl.pathname.startsWith("/_next")){
    NextResponse.next();
  }
  if(request.nextUrl.pathname!=="/login"){
    const url=request.nextUrl.clone();
    url.pathname="/login";
    return NextResponse.redirect(url);
  }
}


export const config = { matcher: '/((?!.*\\.).*)' }
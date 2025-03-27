import { NextRequest, NextResponse } from "next/server";

export async function middleware(request:NextRequest){
  const session=await auth({ trustHost: true });
  if(!session){
    const url=request.nextUrl.clone();
    url.pathname="/login";
    return NextResponse.redirect(url);
  }
   if(request){
  const requestHeaders=new Headers(request.headers);
  requestHeaders.set('x-url',request.url);
  return NextResponse.next({
    request:{
      headers:requestHeaders,
    }
  })
 }
  
}


export const config = { 
  matcher: ["/((?!api|_next/static|.*\\..*|_next/image|favicon.ico|login).*)"],
 }
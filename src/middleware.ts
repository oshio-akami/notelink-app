import { NextRequest, NextResponse } from "next/server";
import { match } from "path-to-regexp";
import { getClient } from "./libs/hono";
import { auth } from "./auth";
import { determineRedirect } from "./libs/group/access";

/**現在のurlのグループに参加しているかを返す非同期関数 */
const hasJoinedGroup = async (groupId: string) => {
  const client = await getClient();
  const res = await client.api.user.hasJoined[":groupId"].$get({
    param: {
      groupId: groupId,
    },
  });
  const body = await res.json();
  return body.hasJoinedGroup;
};

/**参加しているグループ一覧を取得する非同期関数 */
const getJoinedGroups = async () => {
  const client = await getClient();
  const res = await client.api.user.groups.$get();
  const body = await res.json();
  return body.groups ?? [];
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }
  const session = await auth();
  const userId = session?.user?.id;
  //ユーザー情報がなければログインページにリダイレクト
  if (!userId) {
    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(url);
  }

  const pathname = request.nextUrl.pathname;
  const groupMatcher = match("/group/:id/*splat", {
    decode: decodeURIComponent,
  });
  const matched = groupMatcher(pathname);
  if (!matched) {
    return;
  }
  const groupId = matched.params.id?.toString();
  const hasJoinedCurrentGroup = groupId ? await hasJoinedGroup(groupId) : false;
  const joinedGroups = await getJoinedGroups();
  const redirectUrl = determineRedirect(hasJoinedCurrentGroup, joinedGroups);
  if (redirectUrl) {
    const url = request.nextUrl.clone();
    url.pathname = redirectUrl;
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|.*\\..*|_next/image|favicon.ico|login|^$).*)",
  ],
};

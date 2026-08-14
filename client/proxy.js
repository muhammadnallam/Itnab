import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const profileMatch = pathname.match(/^\/@([^/]+)/);
  if (profileMatch) {
    return NextResponse.rewrite(
      new URL(`/profile/${profileMatch[1]}`, request.url),
    );
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/@:username",
    "/new/:path*",
    "/edit/:path*",
    "/settings/:path*",
    "/library/:path*",
    "/analytics/:path",
    "/subscriptions/:path*",
  ],
};
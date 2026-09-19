import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

function safeRedirect(target, fallback = "/") {
    if (typeof target !== "string" || !target.startsWith("/")) return fallback;
    if (target.startsWith("//") || target.startsWith("/\\")) return fallback;
    if (target === "/auth" || target.startsWith("/auth?")) return fallback;
    return target;
}

export function proxy(request) {
    const { pathname } = request.nextUrl;

    const profileMatch = pathname.match(/^\/@([^/]+)/);
    if (profileMatch) {
        return NextResponse.rewrite(
            new URL(`/profile/${profileMatch[1]}`, request.url),
        );
    }

    const sessionCookie = getSessionCookie(request);

    if (pathname === "/auth") {
        if (sessionCookie) {
            const target = safeRedirect(
                request.nextUrl.searchParams.get("redirect"),
            );
            return NextResponse.redirect(new URL(target, request.url));
        }
        return NextResponse.next();
    }

    if (!sessionCookie) {
        const url = new URL("/auth", request.url);
        url.searchParams.set(
            "redirect",
            request.nextUrl.pathname + request.nextUrl.search,
        );
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/@:username",
        "/auth",
        "/new/:path*",
        "/edit/:path*",
        "/settings/:path*",
        "/library/:path*",
        "/analytics/:path",
        "/subscriptions/:path*",
    ],
};

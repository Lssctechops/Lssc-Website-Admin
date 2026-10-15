import { NextResponse } from "next/server";

export function middleware(request) {
  const { cookies } = request;
  const accessToken = cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Always allow framework internals and the auth API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/image") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Not logged in, on the auth page -> allow
  if (!accessToken && (pathname === "/auth-page" || pathname === "/otp-verify")) {
    return NextResponse.next();
  }

  // Already logged in, trying to reach auth page -> send home
  if (
    accessToken &&
    (pathname.startsWith("/auth-page") || pathname.startsWith("/otp-verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Not logged in anywhere else -> send to login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth-page", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET!,
  });

  const isAuthPage =
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/verify");

  const isDashboard = url.pathname.startsWith("/dashboard");
  const isRoot = url.pathname === "/";

  if (token && (isAuthPage || isRoot)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-up", "/sign-in", "/dashboard/:path*", "/verify/:path*", "/"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    // Check for session token
    // better-auth uses "better-auth.session_token" by default
    // We can also check for the secure version if in production
    const sessionToken =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token");

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Note: We can't easily check the Role here without a database call,
    // which is not supported in Edge Middleware with standard Prisma.
    // We will handle strict Role checks in the Server Layout/Page.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

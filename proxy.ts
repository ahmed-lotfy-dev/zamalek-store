import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Run i18n middleware
  const response = intlMiddleware(request);

  // 2. Check for admin route protection
  // Matches /admin, /en/admin, /ar/admin
  const isAdminRoute = pathname.match(/^\/(?:en|ar)?\/?admin/);

  if (isAdminRoute) {
    // Check for session token
    // better-auth uses "better-auth.session_token" by default
    // We can also check for the secure version if in production
    const sessionToken =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token");

    if (!sessionToken) {
      // Redirect to sign-in, preserving locale if present
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || "ar";
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
    }

    // Note: We can't easily check the Role here without a database call,
    // which is not supported in Edge Middleware with standard Prisma.
    // We will handle strict Role checks in the Server Layout/Page.
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

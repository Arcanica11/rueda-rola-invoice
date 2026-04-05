import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /invoice route
  if (pathname.startsWith("/invoice")) {
    const sessionCookie = request.cookies.get("auth_session");

    if (!sessionCookie || !sessionCookie.value) {
      // Not authenticated -> send to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Simple verification (in large scale, decode JWT here)
    // For this simple hardcoded usage, the existence of our own cookie is enough 
    // because we strictly set it in the Server Action upon verification.
  }

  // Redirect root path to /invoice directly 
  // User wants a clean workflow, but we have a landing page on `/`. 
  // We'll leave the landing page as it is.

  return NextResponse.next();
}

// Config to apply middleware ONLY to relevant routes to save edge computing
export const config = {
  matcher: ["/invoice/:path*"],
};

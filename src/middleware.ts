import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  // Build Supabase client for middleware
  const supabase = createServerClient(
    process.env.SUPABASE_INVOICE_URL!,
    process.env.SUPABASE_INVOICE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /invoice routes
  if (pathname.startsWith("/invoice") && !user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in, redirect away from /login
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/invoice", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/invoice/:path*", "/login"],
};

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for auth operations.
 * Uses the invoice project (facturasRueda).
 */
export async function createAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.SUPABASE_INVOICE_URL!,
    process.env.SUPABASE_INVOICE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — safe to ignore
          }
        },
      },
    }
  );
}

/**
 * Browser-side Supabase client for auth operations (used in Client Components).
 */
export function createBrowserAuthClient() {
  const { createBrowserClient } = require("@supabase/ssr");
  return createBrowserClient(
    process.env.NEXT_PUBLIC_INVOICE_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_INVOICE_SUPABASE_ANON_KEY!
  );
}

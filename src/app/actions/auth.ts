"use server";

import { cookies } from "next/headers";

// In-memory verification mapping mapping username lowercased to their strict password
const VALID_USERS: Record<string, string> = {
  antonella: "Rueda2026@",
  ivan: "Mima020233",
};

export async function loginUser(prevState: any, formData: FormData) {
  const username = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const userKey = username.toLowerCase().trim();

  // Validate existence and password
  if (VALID_USERS[userKey] && VALID_USERS[userKey] === password) {
    // Generate simple token payload (In a real app this would be a signed JWT)
    const sessionPayload = Buffer.from(JSON.stringify({ user: userKey, ts: Date.now() })).toString("base64");
    
    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_session", sessionPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  }

  return { success: false, error: "Usuario o contraseña incorrectos" };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  return { success: true };
}

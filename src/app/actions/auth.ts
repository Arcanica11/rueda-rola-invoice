"use server";

import { createAuthClient } from "@/lib/supabase-auth";
import { redirect } from "next/navigation";

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const supabase = await createAuthClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "Email o contraseña incorrectos." };
  }

  return { success: true };
}

export async function logoutUser() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function changePassword(prevState: any, formData: FormData) {
  const newPassword = formData.get("newPassword")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Las contraseñas no coinciden." };
  }

  const supabase = await createAuthClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { success: false, error: `Error: ${error.message}` };
  }

  return { success: true, message: "Contraseña actualizada exitosamente." };
}

export async function getSessionUser() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

"use server";

import { redirect } from "next/navigation";

import type { AppRole, ProfileRow } from "@/lib/types";
import {
  buildLoginHref,
  getDefaultAuthenticatedPath,
} from "@/lib/auth/guards";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";

export interface LoginActionState {
  error?: string;
}

function resolvePostLoginPath(role: AppRole, nextPath?: string) {
  if (!nextPath) {
    return getDefaultAuthenticatedPath(role);
  }

  if (nextPath === "/admin" || nextPath.startsWith("/admin/")) {
    return role === "admin" ? nextPath : "/unauthorized";
  }

  if (nextPath === "/staff" || nextPath.startsWith("/staff/")) {
    return role === "admin" || role === "staff"
      ? nextPath
      : "/unauthorized";
  }

  return getDefaultAuthenticatedPath(role);
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const parsedInput = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!parsedInput.success) {
    return {
      error:
        parsedInput.error.issues[0]?.message ??
        "We could not validate those login details.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { email, password, next } = parsedInput.data;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      error: error?.message ?? "Email or password is incorrect.",
    };
  }

  const adminClient = createSupabaseServiceRoleClient();
  const { data: profileData, error: profileError } = await adminClient
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  const profile = (profileData as Pick<ProfileRow, "role" | "is_active"> | null) ?? null;

  if (profileError || !profile || !profile.is_active) {
    await supabase.auth.signOut();

    return {
      error:
        "Your account does not have an active venue profile yet. Contact the venue admin.",
    };
  }

  redirect(resolvePostLoginPath(profile.role, next));
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  redirect(buildLoginHref());
}

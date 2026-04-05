import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import type {
  AppRole,
  AuthContext,
  Profile,
  ProfileWithVenueRow,
} from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapProfile(row: ProfileWithVenueRow): Profile {
  const venue = Array.isArray(row.venues) ? row.venues[0] : row.venues;

  return {
    id: row.id,
    venueId: row.venue_id,
    venueName: venue?.name ?? "",
    venueSlug: venue?.slug ?? "",
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export function buildLoginHref(nextPath?: string) {
  const searchParams = new URLSearchParams();

  if (nextPath) {
    searchParams.set("next", nextPath);
  }

  const query = searchParams.toString();

  return `/login${query ? `?${query}` : ""}`;
}

export function getDefaultAuthenticatedPath(role: AppRole) {
  return role === "admin" ? "/admin" : "/staff";
}

export async function loadOptionalAuthContext(): Promise<AuthContext | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, venue_id, full_name, role, is_active, created_at, venues(id, name, slug)")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profileData) {
    return null;
  }

  const profile = mapProfile(profileData as ProfileWithVenueRow);

  if (!profile.isActive) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    profile,
  };
}

export const getOptionalAuthContext = cache(loadOptionalAuthContext);

export async function requireAuthContext(options: {
  allowedRoles: AppRole[];
  nextPath: string;
}) {
  const authContext = await getOptionalAuthContext();

  if (!authContext) {
    redirect(buildLoginHref(options.nextPath));
  }

  if (!options.allowedRoles.includes(authContext.profile.role)) {
    redirect("/unauthorized");
  }

  return authContext;
}

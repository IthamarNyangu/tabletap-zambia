import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseServerConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  return { url, anonKey, serviceRoleKey };
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseServerConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can read cookies but may not be able to write them.
        }
      },
    },
  });
}

export function createSupabasePublicServerClient() {
  const { url, anonKey } = getSupabaseServerConfig();

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createSupabaseServiceRoleClient() {
  const { url, serviceRoleKey } = getSupabaseServerConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

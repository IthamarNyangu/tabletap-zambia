import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function getSupabaseProxyConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return { url, anonKey };
}

function buildLoginRedirect(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return loginUrl;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const { url, anonKey } = getSupabaseProxyConfig();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedPath =
    pathname === "/staff" ||
    pathname.startsWith("/staff/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (!user && isProtectedPath) {
    return NextResponse.redirect(buildLoginRedirect(request));
  }

  return response;
}

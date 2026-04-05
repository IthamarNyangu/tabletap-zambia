import "server-only";

import type { NextRequest } from "next/server";

const nonRoutableHosts = new Set(["0.0.0.0", "127.0.0.1", "localhost", "::1"]);

function normalizeConfiguredUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function normalizeOriginFromHost(host?: string | null, protocol?: string | null) {
  if (!host) {
    return null;
  }

  const safeProtocol =
    protocol?.replace(/:$/, "") === "http" ? "http" : "https";

  try {
    return new URL(`${safeProtocol}://${host}`).origin;
  } catch {
    return null;
  }
}

function isRoutableOrigin(origin: string) {
  try {
    return !nonRoutableHosts.has(new URL(origin).hostname);
  } catch {
    return false;
  }
}

export function getPublicUrlSetupHint() {
  return "Set APP_URL or NEXT_PUBLIC_APP_URL to your phone-reachable URL, then re-download the QR code.";
}

export function resolvePublicAppOrigin(request: NextRequest) {
  const configuredOrigin =
    normalizeConfiguredUrl(process.env.APP_URL) ??
    normalizeConfiguredUrl(process.env.NEXT_PUBLIC_APP_URL) ??
    normalizeConfiguredUrl(
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null
    ) ??
    normalizeConfiguredUrl(
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    );

  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (isRoutableOrigin(request.nextUrl.origin)) {
    return request.nextUrl.origin;
  }

  const forwardedOrigin = normalizeOriginFromHost(
    request.headers.get("x-forwarded-host"),
    request.headers.get("x-forwarded-proto")
  );

  if (forwardedOrigin && isRoutableOrigin(forwardedOrigin)) {
    return forwardedOrigin;
  }

  const hostOrigin = normalizeOriginFromHost(
    request.headers.get("host"),
    request.nextUrl.protocol
  );

  if (hostOrigin && isRoutableOrigin(hostOrigin)) {
    return hostOrigin;
  }

  return null;
}

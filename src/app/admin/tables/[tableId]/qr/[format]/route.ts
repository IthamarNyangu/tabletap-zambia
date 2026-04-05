import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  buildLoginHref,
  loadOptionalAuthContext,
} from "@/lib/auth/guards";
import {
  buildTableQrFileName,
  generateTableQrPdf,
  generateTableQrPng,
} from "@/lib/qr-code";
import {
  getPublicUrlSetupHint,
  resolvePublicAppOrigin,
} from "@/lib/public-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminEntityIdSchema, qrDownloadFormatSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildUnauthorizedRedirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(buildLoginHref(path), request.url));
}

function buildQrSetupRedirect(request: NextRequest, message: string) {
  const fallbackUrl = new URL("/admin/tables", request.url);
  const referer = request.headers.get("referer");

  if (referer) {
    try {
      const refererUrl = new URL(referer);

      if (
        refererUrl.pathname.startsWith("/admin/tables") &&
        refererUrl.origin === request.nextUrl.origin
      ) {
        refererUrl.searchParams.set("error", message);
        return NextResponse.redirect(refererUrl);
      }
    } catch {
      // Ignore malformed referer values and fall back to the tables page.
    }
  }

  fallbackUrl.searchParams.set("error", message);
  return NextResponse.redirect(fallbackUrl);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string; format: string }> }
) {
  const resolvedParams = await params;
  const parsedTableId = adminEntityIdSchema.safeParse(resolvedParams.tableId);
  const parsedFormat = qrDownloadFormatSchema.safeParse(resolvedParams.format);

  if (!parsedTableId.success || !parsedFormat.success) {
    return NextResponse.json(
      { error: "That QR download request is invalid." },
      { status: 400 }
    );
  }

  const authContext = await loadOptionalAuthContext();

  if (!authContext) {
    return buildUnauthorizedRedirect(request, "/admin/tables");
  }

  if (authContext.profile.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tables")
    .select("id, table_number, label, qr_code_value")
    .eq("id", parsedTableId.data)
    .eq("venue_id", authContext.profile.venueId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "We could not load that table QR code right now." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "That table could not be found for this venue." },
      { status: 404 }
    );
  }

  const publicOrigin = resolvePublicAppOrigin(request);

  if (!publicOrigin) {
    return buildQrSetupRedirect(request, getPublicUrlSetupHint());
  }

  const publicUrl = new URL(
    `/v/${authContext.profile.venueSlug}/t/${data.table_number}`,
    publicOrigin
  ).toString();
  const qrInput = {
    venueName: authContext.profile.venueName,
    venueSlug: authContext.profile.venueSlug,
    tableLabel: data.label,
    tableNumber: data.table_number,
    qrCodeValue: data.qr_code_value,
    publicUrl,
  };
  const fileName = buildTableQrFileName(qrInput, parsedFormat.data);

  if (parsedFormat.data === "png") {
    const pngBytes = await generateTableQrPng(qrInput);

    return new Response(new Uint8Array(pngBytes), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const pdfBytes = Buffer.from(await generateTableQrPdf(qrInput));

  return new Response(new Uint8Array(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}

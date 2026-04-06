import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import sharp from "sharp";

import { getVenueBranding } from "@/lib/venue-branding";

const qrPngOptions = {
  type: "png" as const,
  width: 960,
  margin: 2,
  errorCorrectionLevel: "H" as const,
  color: {
    dark: "#17384AFF",
    light: "#FFFFFFFF",
  },
};

const logoOverlayCache = new Map<string, Promise<Buffer | null>>();

export interface TableQrAssetInput {
  venueName: string;
  venueSlug: string;
  tableLabel: string;
  tableNumber: number;
  qrCodeValue: string;
  publicUrl: string;
}

function getVenueLogoFilePath(venueSlug: string) {
  const branding = getVenueBranding(venueSlug);
  const logoSrc = branding.qrLogoSrc ?? branding.logoSrc;

  if (!logoSrc) {
    return null;
  }

  return path.join(process.cwd(), "public", logoSrc.replace(/^\//, ""));
}

async function loadVenueLogoOverlay(venueSlug: string) {
  if (logoOverlayCache.has(venueSlug)) {
    return logoOverlayCache.get(venueSlug)!;
  }

  const logoPromise = (async () => {
    const logoPath = getVenueLogoFilePath(venueSlug);

    if (!logoPath) {
      return null;
    }

    try {
      const logoBuffer = await readFile(logoPath);
      return await sharp(logoBuffer).trim().png().toBuffer();
    } catch {
      return null;
    }
  })();

  logoOverlayCache.set(venueSlug, logoPromise);

  return logoPromise;
}

async function buildVenueBadgeContent(
  venueSlug: string,
  badgeWidth: number,
  badgeHeight: number
) {
  const logoBuffer = await loadVenueLogoOverlay(venueSlug);

  if (!logoBuffer) {
    return null;
  }

  return sharp(logoBuffer)
    .resize({
      width: badgeWidth - 34,
      height: badgeHeight - 22,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();
}

async function composeBrandedQrPng(input: TableQrAssetInput, qrBuffer: Buffer) {
  const qrMetadata = await sharp(qrBuffer).metadata();
  const qrWidth = qrMetadata.width ?? qrPngOptions.width;
  const qrHeight = qrMetadata.height ?? qrPngOptions.width;
  const badgeWidth = Math.round(qrWidth * 0.38);
  const badgeHeight = Math.round(qrWidth * 0.18);
  const badgeRadius = Math.round(badgeHeight / 2);
  const badgeContent = await buildVenueBadgeContent(
    input.venueSlug,
    badgeWidth,
    badgeHeight
  );

  if (!badgeContent) {
    return qrBuffer;
  }

  const badgeSvg = Buffer.from(
    `
      <svg width="${badgeWidth}" height="${badgeHeight}" viewBox="0 0 ${badgeWidth} ${badgeHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="0"
          y="0"
          width="${badgeWidth}"
          height="${badgeHeight}"
          rx="${badgeRadius}"
          fill="#FFFFFF"
        />
      </svg>
    `.trim()
  );
  const badgeMetadata = await sharp(badgeContent).metadata();
  const badgeLeft = Math.round((badgeWidth - (badgeMetadata.width ?? 0)) / 2);
  const badgeTop = Math.round((badgeHeight - (badgeMetadata.height ?? 0)) / 2);
  const badgeBuffer = await sharp(badgeSvg)
    .composite([
      {
        input: badgeContent,
        left: Math.max(0, badgeLeft),
        top: Math.max(0, badgeTop),
      },
    ])
    .png()
    .toBuffer();

  return sharp(qrBuffer)
    .composite([
      {
        input: badgeBuffer,
        left: Math.round((qrWidth - badgeWidth) / 2),
        top: Math.round((qrHeight - badgeHeight) / 2),
      },
    ])
    .png()
    .toBuffer();
}

function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function truncateText(value: string, maxLength: number) {
  return value.length <= maxLength
    ? value
    : `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}

export function buildTableQrFileName(
  input: Pick<TableQrAssetInput, "venueSlug" | "tableLabel" | "tableNumber">,
  format: "png" | "pdf"
) {
  const safeVenueSlug = slugifySegment(input.venueSlug) || "venue";
  const safeTableLabel =
    slugifySegment(input.tableLabel) || `table-${input.tableNumber}`;

  return `${safeVenueSlug}-${safeTableLabel}-qr.${format}`;
}

export async function generateTableQrPng(input: TableQrAssetInput) {
  const pngBytes = Buffer.from(await QRCode.toBuffer(input.publicUrl, qrPngOptions));

  return composeBrandedQrPng(input, pngBytes);
}

export async function generateTableQrPdf(input: TableQrAssetInput) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([420, 595]);
  const headingFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const qrImage = await pdfDoc.embedPng(await generateTableQrPng(input));
  const { width, height } = page.getSize();
  const cardX = 34;
  const cardY = 58;
  const cardWidth = width - cardX * 2;
  const cardHeight = height - cardY * 2;
  const qrSize = 246;
  const qrX = (width - qrSize) / 2;
  const qrY = 178;
  const accent = rgb(0.09, 0.22, 0.29);
  const accentMuted = rgb(0.33, 0.42, 0.46);
  const softGold = rgb(0.76, 0.63, 0.36);

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.985, 0.978, 0.965),
  });

  page.drawRectangle({
    x: cardX,
    y: cardY,
    width: cardWidth,
    height: cardHeight,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.88, 0.84, 0.78),
    borderWidth: 1.1,
  });

  page.drawRectangle({
    x: cardX + 18,
    y: height - 134,
    width: cardWidth - 36,
    height: 0.9,
    color: rgb(0.91, 0.88, 0.82),
  });

  page.drawText("TableTap Zambia", {
    x: cardX + 24,
    y: height - 94,
    font: headingFont,
    size: 12,
    color: accent,
  });

  page.drawText(input.venueName, {
    x: cardX + 24,
    y: height - 128,
    font: headingFont,
    size: 24,
    color: accent,
  });

  page.drawText(input.tableLabel, {
    x: cardX + 24,
    y: height - 158,
    font: headingFont,
    size: 17,
    color: softGold,
  });

  page.drawText("Scan to open this live table page", {
    x: cardX + 24,
    y: height - 188,
    font: bodyFont,
    size: 11,
    color: accentMuted,
  });

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  page.drawText("Open menu and table service instantly", {
    x: cardX + 24,
    y: 136,
    font: headingFont,
    size: 13,
    color: accent,
  });

  page.drawText(
    `Table ${input.tableNumber} - ${truncateText(input.qrCodeValue, 28)}`,
    {
      x: cardX + 24,
      y: 112,
      font: bodyFont,
      size: 10,
      color: accentMuted,
    }
  );

  page.drawText(truncateText(input.publicUrl, 58), {
    x: cardX + 24,
    y: 90,
    font: bodyFont,
    size: 8.5,
    color: accentMuted,
  });

  page.drawText("Print on a table card or sticker for service access.", {
    x: cardX + 24,
    y: 68,
    font: bodyFont,
    size: 9,
    color: accentMuted,
  });

  return pdfDoc.save();
}

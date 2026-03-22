import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

type ParsedDataUrl = {
  mimeType: string;
  base64: string;
};

function parseDataUrl(dataUrl: string): ParsedDataUrl | null {
  const match = dataUrl.match(/^data:([^;]+);base64,([\s\S]+)$/);

  if (!match) return null;

  const mimeType = match[1];
  const base64 = match[2];

  if (!mimeType || !base64) return null;

  return { mimeType, base64 };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extensionFromMimeType(mimeType: string) {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "png";
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié." },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Body JSON invalide." },
        { status: 400 }
      );
    }

    const { dataUrl, cloneName } = (body ?? {}) as {
      dataUrl?: string;
      cloneName?: string;
    };

    if (!dataUrl || typeof dataUrl !== "string") {
      return NextResponse.json(
        { error: "dataUrl est requis." },
        { status: 400 }
      );
    }

    const parsed = parseDataUrl(dataUrl);

    if (!parsed) {
      return NextResponse.json(
        { error: "Format data URL invalide." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(parsed.base64, "base64");

    if (!buffer.length) {
      return NextResponse.json(
        { error: "Image vide." },
        { status: 400 }
      );
    }

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Image trop lourde (${Math.round(
            buffer.length / 1024 / 1024
          )} MB). Limite: ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`,
        },
        { status: 413 }
      );
    }

    const safeCloneName = slugify(cloneName || "clone-avatar") || "clone-avatar";
    const ext = extensionFromMimeType(parsed.mimeType);

    const pathname = `clones/${userId}/avatars/${Date.now()}-${safeCloneName}.${ext}`;

    const blob = await put(pathname, buffer, {
      access: "public",
      contentType: parsed.mimeType,
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: parsed.mimeType,
      size: buffer.length,
    });
  } catch (error) {
    console.error("[CLONE_AVATAR_FROM_DATAURL_POST]", error);

    return NextResponse.json(
      {
        error: "Impossible de persister l’avatar pour le moment.",
      },
      { status: 500 }
    );
  }
}
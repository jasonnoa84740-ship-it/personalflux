import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const dataUrl = typeof body?.dataUrl === "string" ? body.dataUrl : "";

    if (!dataUrl.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image data URL." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      url: dataUrl,
    });
  } catch (error) {
    console.error("POST /api/clone-avatar-from-dataurl error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d’uploader l’avatar IA.",
      },
      { status: 500 }
    );
  }
}
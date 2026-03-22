import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type RouteContext = {
  params: Promise<{ cloneId: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { userId: clerkUserId } = await auth();
  const { cloneId } = await context.params;

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clone = await db.clone.findFirst({
      where: {
        id: cloneId,
        user: {
          clerkUserId,
        },
      },
      include: {
        characterBible: true,
      },
    });

    if (!clone || !clone.characterBible) {
      return NextResponse.json(
        { error: "Clone not found" },
        { status: 404 }
      );
    }

    const prompt = clone.characterBible.canonicalVisualPrompt;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      n: 3,
    });

    const savedImages = await Promise.all(
      (result.data ?? []).map(async (image, index) => {
        const base64 = image.b64_json;

        if (!base64) {
          throw new Error(`Missing b64 image payload at index ${index}`);
        }

        const dataUrl = `data:image/png;base64,${base64}`;

        return db.cloneMediaAsset.create({
          data: {
            cloneId: clone.id,
            type: "GALLERY",
            url: dataUrl,
            prompt,
            altText: `${clone.name} generated visual ${index + 1}`,
          },
          select: {
            id: true,
            url: true,
            type: true,
            altText: true,
            createdAt: true,
          },
        });
      })
    );

    return NextResponse.json({ images: savedImages });
  } catch (error) {
    console.error("POST /api/clones/[cloneId]/generate-images error:", error);

    return NextResponse.json(
      {
        error: "Image generation failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
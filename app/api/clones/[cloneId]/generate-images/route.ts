import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(
  req: Request,
  { params }: { params: { cloneId: string } }
) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clone = await db.clone.findFirst({
      where: {
        id: params.cloneId,
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

    // 🔥 génération batch (important pour cohérence)
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      n: 3,
    });

    const images = result.data;

    const saved = await Promise.all(
      images.map((img: any) =>
        db.cloneMediaAsset.create({
          data: {
            cloneId: clone.id,
            type: "GALLERY",
            url: img.url,
            prompt,
          },
        })
      )
    );

    return NextResponse.json({
      images: saved,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
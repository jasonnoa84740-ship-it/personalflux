import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSceneTemplate } from "@/lib/scene/templates";
import { buildScenePrompt } from "@/lib/scene/prompt-builder";

const createSceneSchema = z.object({
  cloneId: z.string().min(1),
  templateKey: z.string().min(1),
  title: z.string().min(2),
  environmentPrompt: z.string().optional(),
  cameraPrompt: z.string().optional(),
  wardrobeOverride: z.string().optional(),
});

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSceneSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const clone = await prisma.clone.findFirst({
      where: {
        id: parsed.data.cloneId,
        user: {
          clerkUserId: userId,
        },
      },
      include: {
        characterBible: true,
      },
    });

    if (!clone || !clone.characterBible) {
      return NextResponse.json(
        { error: "Clone or character bible not found" },
        { status: 404 }
      );
    }

    const template = getSceneTemplate(parsed.data.templateKey);

    if (!template) {
      return NextResponse.json(
        { error: "Unknown scene template" },
        { status: 400 }
      );
    }

    const builtPrompt = buildScenePrompt({
      characterSummary: clone.characterBible.characterSummary,
      canonicalVisualPrompt: clone.characterBible.canonicalVisualPrompt,
      negativePrompt: clone.characterBible.negativePrompt,
      actionPrompt: template.actionPrompt,
      environmentPrompt:
        parsed.data.environmentPrompt ?? template.defaultEnvironmentPrompt,
      cameraPrompt:
        parsed.data.cameraPrompt ?? template.defaultCameraPrompt,
      wardrobeOverride: parsed.data.wardrobeOverride,
    });

    const scene = await prisma.cloneScene.create({
      data: {
        cloneId: clone.id,
        templateKey: template.key,
        title: parsed.data.title,
        actionPrompt: builtPrompt.prompt,
        environmentPrompt:
          parsed.data.environmentPrompt ?? template.defaultEnvironmentPrompt,
        cameraPrompt:
          parsed.data.cameraPrompt ?? template.defaultCameraPrompt,
        wardrobeOverride: parsed.data.wardrobeOverride,
        status: "READY",
      },
    });

    return NextResponse.json({
      scene,
      promptPreview: builtPrompt,
    });
  } catch (error) {
    console.error("POST /api/scenes error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
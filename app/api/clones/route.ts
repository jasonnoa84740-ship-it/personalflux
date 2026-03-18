import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function generateUniqueSlug(base: string) {
  let slug = slugify(base);
  if (!slug) slug = `clone-${Date.now()}`;

  let finalSlug = slug;
  let count = 1;

  while (true) {
    const existing = await db.clone.findUnique({
      where: { slug: finalSlug },
      select: { id: true },
    });

    if (!existing) return finalSlug;

    count += 1;
    finalSlug = `${slug}-${count}`;
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Utilisateur Clerk introuvable." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      name,
      category,
      shortDescription,
      description,
      avatarUrl,
      responseStyle,
      primaryGoal,
      tone,
      traits,
      visibility,
      status,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Le nom du clone est obligatoire." },
        { status: 400 }
      );
    }

    const normalizedStatus =
      status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

    const normalizedVisibility =
      visibility === "PUBLIC" ||
      visibility === "MEMBERS_ONLY" ||
      visibility === "PRIVATE"
        ? visibility
        : "PRIVATE";

    let user = await db.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          clerkUserId,
          email:
            clerkUser.emailAddresses.find(
              (email) => email.id === clerkUser.primaryEmailAddressId
            )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || null,
          username: clerkUser.username || null,
          imageUrl: clerkUser.imageUrl || null,
        },
        select: { id: true },
      });
    }

    const slug = await generateUniqueSlug(name);

    const clone = await db.clone.create({
      data: {
        userId: user.id,
        name: name.trim(),
        slug,
        category: typeof category === "string" ? category : null,
        shortDescription:
          typeof shortDescription === "string" && shortDescription.trim()
            ? shortDescription.trim()
            : null,
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        avatarUrl:
          typeof avatarUrl === "string" && avatarUrl.trim()
            ? avatarUrl.trim()
            : null,
        responseStyle:
          typeof responseStyle === "string" ? responseStyle : null,
        primaryGoal:
          typeof primaryGoal === "string" ? primaryGoal : null,
        tone: typeof tone === "string" && tone.trim() ? tone.trim() : null,
        traits: Array.isArray(traits)
          ? traits.filter((item): item is string => typeof item === "string")
          : [],
        visibility: normalizedVisibility,
        status: normalizedStatus,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
      },
    });

    return NextResponse.json({ clone }, { status: 201 });
  } catch (error) {
    console.error("POST /api/clones error:", error);

    return NextResponse.json(
      {
        error: "Impossible de créer le clone.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
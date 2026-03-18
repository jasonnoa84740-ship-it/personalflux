import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Utilisateur non connecté." },
        { status: 401 }
      );
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Utilisateur Clerk introuvable." },
        { status: 404 }
      );
    }

    const primaryEmail =
      clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress || null;

    const username =
      clerkUser.username ||
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      "Utilisateur";

    const user = await db.user.upsert({
      where: { clerkUserId },
      update: {
        email: primaryEmail,
        username,
        imageUrl: clerkUser.imageUrl,
      },
      create: {
        clerkUserId,
        email: primaryEmail,
        username,
        imageUrl: clerkUser.imageUrl,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("POST /api/sync-user error:", error);

    return NextResponse.json(
      {
        error: "Impossible de synchroniser l'utilisateur.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cookies, headers } from "next/headers";

export async function GET() {
  const session = await auth();
  const headerStore = await headers();
  const cookieStore = await cookies();

  const allCookies = cookieStore.getAll().map((cookie) => cookie.name);

  return NextResponse.json({
    authUserId: session.userId ?? null,
    host: headerStore.get("host"),
    origin: headerStore.get("origin"),
    referer: headerStore.get("referer"),
    xForwardedHost: headerStore.get("x-forwarded-host"),
    xForwardedProto: headerStore.get("x-forwarded-proto"),
    cookieNames: allCookies,
  });
}
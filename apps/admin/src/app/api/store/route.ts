import { NextResponse } from "next/server";
import { readStore, resetStore, writeStore } from "@farsamo/core/db";
import type { AppState } from "@farsamo/core";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await readStore());
}

export async function PUT(request: Request) {
  const body = (await request.json()) as AppState;
  return NextResponse.json(await writeStore(body));
}

export async function DELETE() {
  return NextResponse.json(await resetStore());
}

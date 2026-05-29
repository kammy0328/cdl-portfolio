import { NextResponse } from "next/server";
import { isAuthed, isConfigured } from "@/lib/admin-auth";

export async function GET() {
  return NextResponse.json({
    authed: await isAuthed(),
    configured: isConfigured(),
  });
}

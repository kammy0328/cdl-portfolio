import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin-auth";
import { getWorks, WORKS_BLOB_PATH } from "@/lib/works";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, works: await getWorks() });
}

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Blob storage not configured" },
      { status: 500 }
    );
  }
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.works)) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  await put(WORKS_BLOB_PATH, JSON.stringify(body.works, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });

  // 사이트 페이지 캐시 갱신
  try {
    revalidatePath("/");
    revalidatePath("/gallery");
  } catch {
    /* noop */
  }

  return NextResponse.json({ ok: true });
}

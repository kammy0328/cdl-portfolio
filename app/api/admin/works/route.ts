import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAuthed } from "@/lib/admin-auth";
import { loadWorks, WORKS_BLOB_PATH } from "@/lib/works";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, works: await loadWorks() });
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
    cacheControlMaxAge: 0,
    token,
  });

  // 데이터 캐시 무효화 + 페이지 갱신 → 저장 즉시 반영
  try {
    revalidateTag("works");
    revalidatePath("/");
    revalidatePath("/gallery");
  } catch {
    /* noop */
  }

  return NextResponse.json({ ok: true });
}

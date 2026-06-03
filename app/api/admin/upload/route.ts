import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";

// 클라이언트에서 WebP로 압축한 이미지를 받아 Blob에 업로드
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

  const form = await req.formData();
  const file = form.get("file");
  const w = Number(form.get("w")) || undefined;
  const h = Number(form.get("h")) || undefined;
  if (!(file instanceof Blob)) {
    return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
  }
  // 업로드 용량 제한 — 클라이언트가 WebP로 압축하므로 15MB면 충분 (오용/실수 방지)
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json(
      { ok: false, error: "파일이 너무 큽니다 (최대 15MB)." },
      { status: 413 }
    );
  }

  const name = `stills/${crypto.randomUUID()}.webp`;
  const blob = await put(name, file, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: false,
    token,
  });

  return NextResponse.json({ ok: true, src: blob.url, w, h });
}

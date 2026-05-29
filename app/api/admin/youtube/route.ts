import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";

// 유튜브 ID로 제목·아티스트·업로드 날짜를 가져와 폼 자동 채우기 지원
export async function GET(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "no id" }, { status: 400 });

  let title = "";
  let artist = "";
  let publishedAt = "";

  try {
    const o = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      { cache: "no-store" }
    );
    if (o.ok) {
      const j = await o.json();
      title = j.title ?? "";
      artist = j.author_name ?? "";
    }
  } catch {
    /* noop */
  }

  try {
    const p = await fetch(`https://www.youtube.com/watch?v=${id}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (p.ok) {
      const html = await p.text();
      const m = html.match(/"uploadDate":"([^"]+)"/);
      if (m) publishedAt = m[1].slice(0, 10);
    }
  } catch {
    /* noop */
  }

  return NextResponse.json({ ok: true, title, artist, publishedAt });
}

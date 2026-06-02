import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { parseVideo } from "@/lib/video";

export const runtime = "nodejs";

// 영상 URL/ID로 제목·아티스트·날짜·(Vimeo)썸네일을 가져옴 (YouTube + Vimeo)
export async function GET(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const raw = new URL(req.url).searchParams.get("url") || "";
  const v = parseVideo(raw);
  if (!v) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  let title = "";
  let artist = "";
  let publishedAt = "";
  let thumb = "";

  if (v.platform === "youtube") {
    try {
      const o = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.id}&format=json`,
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
      const p = await fetch(`https://www.youtube.com/watch?v=${v.id}`, {
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
  } else {
    try {
      const o = await fetch(
        `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${v.id}`,
        { cache: "no-store" }
      );
      if (o.ok) {
        const j = await o.json();
        title = j.title ?? "";
        artist = j.author_name ?? "";
        thumb = j.thumbnail_url ?? "";
        if (j.upload_date) publishedAt = String(j.upload_date).slice(0, 10);
      }
    } catch {
      /* noop */
    }
  }

  return NextResponse.json({
    ok: true,
    platform: v.platform,
    id: v.id,
    title,
    artist,
    publishedAt,
    thumb,
  });
}

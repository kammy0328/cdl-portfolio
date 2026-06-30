import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAuthed } from "@/lib/admin-auth";
import { loadWorksRaw, WORKS_BLOB_PATH } from "@/lib/works";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, works: await loadWorksRaw() });
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
    revalidatePath("/", "layout"); // 홈·갤러리·모든 작품 페이지 일괄 무효화
  } catch {
    /* noop */
  }

  // GitHub에 works-saved.json 백업 커밋 (GITHUB_TOKEN 없으면 무시)
  void backupToGitHub(body.works);

  return NextResponse.json({ ok: true });
}

async function backupToGitHub(works: unknown[]) {
  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) return;

  const repo = "kammy0328/cdl-portfolio";
  const path = "data/works-saved.json";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${ghToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  try {
    // 현재 파일 SHA 조회 (업데이트 시 필요)
    const existing = await fetch(apiUrl, { headers }).then((r) =>
      r.ok ? r.json() : null
    );
    const sha: string | undefined = existing?.sha;

    const content = Buffer.from(JSON.stringify(works, null, 2)).toString("base64");
    await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "chore: sync works from admin",
        content,
        sha,
        branch: "main",
      }),
    });
  } catch {
    // 백업 실패는 비치명적 — Blob 저장은 이미 완료됨
  }
}

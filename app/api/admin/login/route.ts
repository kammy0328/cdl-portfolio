import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, isConfigured, safeEqual } from "@/lib/admin-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // 무차별 대입 방어 — IP당 10회 / 10분
  if (!rateLimit(`login:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." },
      { status: 429 }
    );
  }
  if (!isConfigured()) {
    return NextResponse.json({ ok: false, configured: false });
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  const pw = process.env.ADMIN_PASSWORD;
  if (!password || !pw || !safeEqual(password, pw)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken()!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30일
  });
  return res;
}

import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "cdl_admin";

/** 길이 무관 상수시간 비교 — 양쪽을 SHA-256으로 고정 길이화 후 비교 (타이밍 공격 방어) */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** ADMIN_PASSWORD에서 파생한 쿠키 토큰 (원문 비밀번호는 저장하지 않음) */
export function adminToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHmac("sha256", pw).update("cdl-admin-v1").digest("hex");
}

export function isConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

/** 현재 요청의 쿠키가 유효한 관리자 토큰인지 */
export async function isAuthed(): Promise<boolean> {
  const t = adminToken();
  if (!t) return false;
  const jar = await cookies();
  return safeEqual(jar.get(ADMIN_COOKIE)?.value ?? "", t);
}

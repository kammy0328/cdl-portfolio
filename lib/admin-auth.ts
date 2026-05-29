import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "cdl_admin";

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
  return jar.get(ADMIN_COOKIE)?.value === t;
}

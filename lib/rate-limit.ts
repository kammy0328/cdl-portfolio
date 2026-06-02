// 간단한 인메모리 요청 제한 (서버 인스턴스별). 무차별 대입/스팸의 1차 방어용.
// 완전한 분산 제한이 필요하면 Vercel KV/Upstash로 교체 가능.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

/** true = 허용, false = 한도 초과(차단) */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = store.get(key);
  if (!b || now > b.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || "unknown";
}

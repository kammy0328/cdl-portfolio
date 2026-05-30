import { NextResponse } from "next/server";
import { site } from "@/lib/site";

// 문의 폼 → Resend 로 이메일 전송.
// RESEND_API_KEY 환경변수가 설정되지 않았으면 ok:false, configured:false 를 반환하고
// 프론트엔드가 자동으로 메일 앱(mailto)으로 폴백합니다.
// 이메일(Resend) 연동 여부를 프론트엔드에 알려줌
export async function GET() {
  return NextResponse.json({ configured: !!process.env.RESEND_API_KEY });
}

export async function POST(req: Request) {
  try {
    const { name, email, type, message, website } = await req.json();

    // 허니팟이 채워졌으면 봇 → 조용히 성공 응답하고 전송하지 않음
    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "필수 항목이 비어 있습니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // 아직 미설정 → 클라이언트가 mailto 로 폴백
      return NextResponse.json({ ok: false, configured: false });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const text = `이름: ${name}
이메일: ${email}
프로젝트 유형: ${type ?? "-"}

${message}`;

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.7;color:#111">
        <h2 style="margin:0 0 16px">새 문의가 도착했습니다</h2>
        <p><strong>이름</strong> : ${escapeHtml(name)}</p>
        <p><strong>이메일</strong> : ${escapeHtml(email)}</p>
        <p><strong>프로젝트 유형</strong> : ${escapeHtml(type ?? "-")}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>`;

    const { error } = await resend.emails.send({
      // 도메인 인증 전에는 onboarding@resend.dev 로 발송 (수신자는 본인 메일)
      from: "CDL Portfolio <onboarding@resend.dev>",
      to: [site.email],
      replyTo: email,
      subject: `[CDL 문의] ${name} · ${type ?? ""}`,
      text,
      html,
    });

    if (error) {
      return NextResponse.json({ ok: false, configured: true, error: String(error) });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

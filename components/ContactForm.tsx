"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "fallback";

const projectTypes = ["뮤직비디오", "광고 / CF", "필름 / 단편", "기타"];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: projectTypes[0],
    message: "",
  });

  const update = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const mailtoHref = () => {
    const subject = `[CDL 문의] ${form.name || ""} · ${form.type}`;
    const body = `이름: ${form.name}
이메일: ${form.email}
프로젝트 유형: ${form.type}

${form.message}`;
    return `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      // 서버 전송이 아직 설정되지 않았거나 실패 → 메일 앱으로 폴백
      window.location.href = mailtoHref();
      setStatus("fallback");
    } catch {
      window.location.href = mailtoHref();
      setStatus("fallback");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-sm border border-ink-line bg-ink-card p-8 text-center animate-fade-up">
        <div className="text-accent-cool">
          <svg className="mx-auto" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium">문의가 전송되었습니다.</h3>
        <p className="mt-2 text-sm text-bone-dim">
          빠른 시일 내에 {site.email} 에서 답변드리겠습니다. 감사합니다.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-sm border border-ink-line bg-ink-soft px-4 py-3 text-bone placeholder:text-bone-faint outline-none transition focus:border-accent-warm/60 focus:ring-1 focus:ring-accent-warm/30";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {status === "fallback" && (
        <p className="rounded-sm border border-accent-warm/30 bg-accent-warm/5 px-4 py-3 text-sm text-bone-dim">
          메일 앱이 열리지 않았다면{" "}
          <a href={mailtoHref()} className="text-accent-warm underline">
            여기를 눌러
          </a>{" "}
          {site.email} 로 보내주세요.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label mb-2 block">이름 *</label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className={field}
            placeholder="성함 또는 회사명"
          />
        </div>
        <div>
          <label className="label mb-2 block">이메일 *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className={field}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label className="label mb-2 block">프로젝트 유형</label>
        <select value={form.type} onChange={update("type")} className={field}>
          {projectTypes.map((t) => (
            <option key={t} value={t} className="bg-ink-soft">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label mb-2 block">문의 내용 *</label>
        <textarea
          required
          value={form.message}
          onChange={update("message")}
          rows={6}
          className={`${field} resize-none`}
          placeholder="작업 일정, 분량(러닝타임), 촬영 카메라/코덱, 희망 톤앤매너 등을 적어주시면 빠른 견적에 도움이 됩니다."
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex items-center gap-2 rounded-sm bg-bone px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-accent-warm disabled:opacity-60"
      >
        {status === "sending" ? "전송 중…" : "문의 보내기"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition group-hover:translate-x-0.5">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}

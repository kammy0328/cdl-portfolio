"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "fallback";

const projectTypes = ["뮤직비디오", "광고", "필름", "기타"];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [warned, setWarned] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);

  // 이메일(Resend) 연동 여부 확인 — 연동돼 있으면 경고를 띄우지 않음
  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setConfigured(!!d.configured))
      .catch(() => setConfigured(false));
  }, []);
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: projectTypes[0],
    message: "",
    website: "", // 허니팟 — 사람에겐 보이지 않음, 봇이 채우면 무시
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
      window.location.href = mailtoHref();
      setStatus("fallback");
    } catch {
      window.location.href = mailtoHref();
      setStatus("fallback");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-sm border border-ink-line bg-ink-card p-8 animate-fade-up">
        <h3 className="text-lg font-medium">문의가 전송되었습니다.</h3>
        <p className="mt-2 text-sm text-bone-dim">
          빠른 시일 내에 답변드리겠습니다.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-sm border border-ink-line bg-ink-soft px-4 py-3 text-bone placeholder:text-bone-faint outline-none transition focus:border-accent-warm/60 focus:ring-1 focus:ring-accent-warm/30";

  return (
    <form onSubmit={onSubmit} onFocusCapture={() => setWarned(true)} className="space-y-5">
      {warned && configured === false && status !== "fallback" && (
        <p className="rounded-sm border border-accent-warm/40 bg-accent-warm/10 px-4 py-3 text-sm text-bone">
          이 문의 폼은 아직 이메일과 연동되어 있지 않아요.{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-accent-warm underline">
            {site.email}
          </a>{" "}
          로 직접 보내주시면 가장 빠릅니다.
        </p>
      )}

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
          <label className="label mb-2 block">이름</label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className={field}
            placeholder="성함 또는 회사명"
          />
        </div>
        <div>
          <label className="label mb-2 block">이메일</label>
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
        <label className="label mb-2 block">내용</label>
        <textarea
          required
          value={form.message}
          onChange={update("message")}
          rows={6}
          className={`${field} resize-none`}
          placeholder="작업 일정, 분량, 카메라/코덱, 원하는 톤 등을 적어주세요."
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 rounded-sm bg-bone px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-accent-warm disabled:opacity-60"
      >
        {status === "sending" ? "전송 중…" : "보내기"}
      </button>

      {/* 허니팟: 사용자에겐 숨김, 봇 탐지용 (레이아웃 영향 없도록 폼 끝에 배치) */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={update("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
    </form>
  );
}

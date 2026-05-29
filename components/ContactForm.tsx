"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "fallback";

const projectTypes = ["Music Video", "Commercial", "Film", "Other"];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
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
    const subject = `[CDL Inquiry] ${form.name || ""} · ${form.type}`;
    const body = `Name: ${form.name}
Email: ${form.email}
Project type: ${form.type}

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
        <h3 className="mt-4 text-lg font-medium">Message sent.</h3>
        <p className="mt-2 text-sm text-bone-dim">
          Thanks — I&apos;ll get back to you at {site.email} shortly.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-sm border border-ink-line bg-ink-soft px-4 py-3 text-bone placeholder:text-bone-faint outline-none transition focus:border-accent-warm/60 focus:ring-1 focus:ring-accent-warm/30";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* 허니팟: 스크린리더/사용자에겐 숨김, 봇 탐지용 */}
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

      {status === "fallback" && (
        <p className="rounded-sm border border-accent-warm/30 bg-accent-warm/5 px-4 py-3 text-sm text-bone-dim">
          If your mail app didn&apos;t open,{" "}
          <a href={mailtoHref()} className="text-accent-warm underline">
            click here
          </a>{" "}
          to email {site.email}.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label mb-2 block">Name *</label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className={field}
            placeholder="Your name or company"
          />
        </div>
        <div>
          <label className="label mb-2 block">Email *</label>
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
        <label className="label mb-2 block">Project Type</label>
        <select value={form.type} onChange={update("type")} className={field}>
          {projectTypes.map((t) => (
            <option key={t} value={t} className="bg-ink-soft">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label mb-2 block">Message *</label>
        <textarea
          required
          value={form.message}
          onChange={update("message")}
          rows={6}
          className={`${field} resize-none`}
          placeholder="Timeline, runtime, camera/codec, and the look you're after — anything that helps me scope a quote."
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex items-center gap-2 rounded-sm bg-bone px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-accent-warm disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition group-hover:translate-x-0.5">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}

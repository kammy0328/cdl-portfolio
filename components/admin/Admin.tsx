"use client";

import { useEffect, useRef, useState } from "react";
import { compressImage, parseYouTubeId } from "@/lib/compress";
import type { Work } from "@/data/works";

type Phase = "loading" | "needconfig" | "login" | "ready";

const CATEGORIES = ["Music Video", "Commercial", "Film", "Other"];

const blankWork = (): Work => ({
  slug: "",
  title: "",
  artist: "",
  category: "Music Video",
  youtubeId: "",
  publishedAt: "",
  description: "",
  credits: [],
  stills: [],
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

const fieldCls =
  "w-full rounded-sm border border-ink-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-faint outline-none transition focus:border-accent-warm/60";

export default function Admin() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    void init();
  }, []);

  async function init() {
    try {
      const me = await fetch("/api/admin/me").then((r) => r.json());
      if (!me.configured) return setPhase("needconfig");
      if (!me.authed) return setPhase("login");
      await loadWorks();
      setPhase("ready");
    } catch {
      setPhase("login");
    }
  }

  async function loadWorks() {
    const r = await fetch("/api/admin/works").then((r) => r.json());
    if (r.ok) setWorks(r.works);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.ok) {
      setPassword("");
      await loadWorks();
      setPhase("ready");
    } else {
      setLoginErr("비밀번호가 올바르지 않습니다.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setWorks([]);
    setPhase("login");
  }

  // ---- works helpers ----
  const update = (i: number, patch: Partial<Work>) =>
    setWorks((ws) => ws.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));
  const addWork = () => setWorks((ws) => [blankWork(), ...ws]);
  const removeWork = (i: number) =>
    confirm("이 작업을 삭제할까요?") &&
    setWorks((ws) => ws.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) =>
    setWorks((ws) => {
      const j = i + dir;
      if (j < 0 || j >= ws.length) return ws;
      const copy = [...ws];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  async function fetchYt(i: number, raw: string) {
    const id = parseYouTubeId(raw);
    update(i, { youtubeId: id });
    if (id.length < 5) return;
    const r = await fetch(`/api/admin/youtube?id=${encodeURIComponent(id)}`).then((r) => r.json());
    if (r.ok) {
      update(i, {
        title: works[i].title || r.title || "",
        artist: works[i].artist || r.artist || "",
        publishedAt: works[i].publishedAt || r.publishedAt || "",
        slug: works[i].slug || slugify(r.title || ""),
      });
    }
  }

  async function handleFiles(i: number, list: FileList | null) {
    if (!list) return;
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    for (const file of files) {
      setUploading((n) => n + 1);
      try {
        const { blob, w, h } = await compressImage(file);
        const fd = new FormData();
        fd.append("file", blob, "still.webp");
        fd.append("w", String(w));
        fd.append("h", String(h));
        const r = await fetch("/api/admin/upload", { method: "POST", body: fd }).then((r) => r.json());
        if (r.ok) {
          setWorks((ws) =>
            ws.map((wk, idx) =>
              idx === i ? { ...wk, stills: [...wk.stills, { src: r.src, w: r.w, h: r.h }] } : wk
            )
          );
        }
      } catch {
        /* skip failed file */
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  async function save() {
    const prepared = works.map((w) => ({
      ...w,
      slug: w.slug || slugify(w.title),
      youtubeId: parseYouTubeId(w.youtubeId),
    }));
    setSaving(true);
    setMsg("");
    const r = await fetch("/api/admin/works", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ works: prepared }),
    });
    setSaving(false);
    if (r.ok) {
      setWorks(prepared);
      setMsg("저장되었습니다. 사이트에 반영됩니다.");
      setTimeout(() => setMsg(""), 4000);
    } else {
      setMsg("저장에 실패했습니다.");
    }
  }

  // ---- render ----
  if (phase === "loading")
    return <div className="wrap pt-32 text-sm text-bone-dim">로딩 중…</div>;

  if (phase === "needconfig")
    return (
      <div className="wrap pt-32">
        <h1 className="text-2xl font-semibold">관리자 설정 필요</h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-bone-dim">
          Vercel 프로젝트 환경변수에 <code className="text-accent-warm">ADMIN_PASSWORD</code>
          를 추가한 뒤 재배포하면 로그인 화면이 나타납니다.
        </p>
      </div>
    );

  if (phase === "login")
    return (
      <div className="wrap flex min-h-[70vh] items-center justify-center pt-24">
        <form onSubmit={login} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-[0.2em]">ADMIN</h1>
          <p className="mt-2 text-sm text-bone-dim">관리자 비밀번호를 입력하세요.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${fieldCls} mt-6`}
            placeholder="비밀번호"
            autoFocus
          />
          {loginErr && <p className="mt-2 text-sm text-red-400">{loginErr}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-sm bg-bone py-3 text-sm font-medium text-ink transition hover:bg-accent-warm"
          >
            로그인
          </button>
        </form>
      </div>
    );

  // ready
  return (
    <div className="wrap pt-24 pb-32">
      <div className="sticky top-16 z-30 -mx-5 mb-8 flex items-center justify-between border-b border-ink-line bg-ink/90 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <h1 className="text-xl font-bold tracking-[0.2em]">ADMIN</h1>
        <div className="flex items-center gap-3">
          {uploading > 0 && (
            <span className="label !text-accent-warm">업로드 중 {uploading}…</span>
          )}
          {msg && <span className="label !text-accent-cool">{msg}</span>}
          <button
            onClick={addWork}
            className="rounded-sm border border-ink-line px-4 py-2 text-sm transition hover:bg-white/5"
          >
            + 작업 추가
          </button>
          <button
            onClick={save}
            disabled={saving || uploading > 0}
            className="rounded-sm bg-bone px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-warm disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
          <button
            onClick={logout}
            className="rounded-sm px-3 py-2 text-sm text-bone-dim transition hover:text-bone"
          >
            로그아웃
          </button>
        </div>
      </div>

      {works.length === 0 && (
        <p className="text-sm text-bone-dim">
          작업이 없습니다. “+ 작업 추가”로 시작하세요.
        </p>
      )}

      <div className="space-y-6">
        {works.map((w, i) => (
          <WorkEditor
            key={i}
            work={w}
            index={i}
            total={works.length}
            uploading={uploading}
            onChange={(patch) => update(i, patch)}
            onRemove={() => removeWork(i)}
            onMove={(dir) => move(i, dir)}
            onFetchYt={(raw) => fetchYt(i, raw)}
            onFiles={(list) => handleFiles(i, list)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================ Work editor ============================

function WorkEditor({
  work,
  index,
  total,
  uploading,
  onChange,
  onRemove,
  onMove,
  onFetchYt,
  onFiles,
}: {
  work: Work;
  index: number;
  total: number;
  uploading: number;
  onChange: (patch: Partial<Work>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  onFetchYt: (raw: string) => void;
  onFiles: (list: FileList | null) => void;
}) {
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-sm border border-ink-line bg-ink-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="label">#{index + 1}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onMove(-1)} disabled={index === 0} className="px-2 text-bone-dim hover:text-bone disabled:opacity-30" aria-label="위로">↑</button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className="px-2 text-bone-dim hover:text-bone disabled:opacity-30" aria-label="아래로">↓</button>
          <button onClick={onRemove} className="ml-2 text-sm text-red-400 hover:text-red-300">삭제</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">유튜브 URL / ID</span>
          <div className="mt-1 flex gap-2">
            <input
              className={fieldCls}
              value={work.youtubeId}
              onChange={(e) => onChange({ youtubeId: e.target.value })}
              placeholder="youtu.be/XXXX 또는 ID"
            />
            <button
              type="button"
              onClick={() => onFetchYt(work.youtubeId)}
              className="shrink-0 rounded-sm border border-ink-line px-3 text-xs text-bone-dim transition hover:bg-white/5 hover:text-bone"
            >
              불러오기
            </button>
          </div>
        </label>
        <label className="block">
          <span className="label">제목</span>
          <input className={`${fieldCls} mt-1`} value={work.title} onChange={(e) => onChange({ title: e.target.value })} />
        </label>
        <label className="block">
          <span className="label">아티스트</span>
          <input className={`${fieldCls} mt-1`} value={work.artist} onChange={(e) => onChange({ artist: e.target.value })} />
        </label>
        <label className="block">
          <span className="label">카테고리</span>
          <select className={`${fieldCls} mt-1`} value={work.category} onChange={(e) => onChange({ category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-ink-soft">{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">릴리즈 (업로드 날짜)</span>
          <input type="date" className={`${fieldCls} mt-1`} value={work.publishedAt} onChange={(e) => onChange({ publishedAt: e.target.value })} />
        </label>
        <label className="block">
          <span className="label">slug (URL, 비우면 자동)</span>
          <input className={`${fieldCls} mt-1`} value={work.slug} onChange={(e) => onChange({ slug: e.target.value })} placeholder="artist-title" />
        </label>
      </div>

      {/* 크레딧 */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="label">크레딧</span>
          <button
            type="button"
            onClick={() => onChange({ credits: [...work.credits, { role: "", name: "" }] })}
            className="text-xs text-bone-dim hover:text-bone"
          >
            + 크레딧 추가
          </button>
        </div>
        <div className="space-y-2">
          {work.credits.map((c, ci) => (
            <div key={ci} className="flex gap-2">
              <input
                className={`${fieldCls} max-w-[10rem]`}
                placeholder="직무 (예: 감독)"
                value={c.role}
                onChange={(e) =>
                  onChange({ credits: work.credits.map((x, k) => (k === ci ? { ...x, role: e.target.value } : x)) })
                }
              />
              <input
                className={fieldCls}
                placeholder="이름"
                value={c.name}
                onChange={(e) =>
                  onChange({ credits: work.credits.map((x, k) => (k === ci ? { ...x, name: e.target.value } : x)) })
                }
              />
              <button
                type="button"
                onClick={() => onChange({ credits: work.credits.filter((_, k) => k !== ci) })}
                className="shrink-0 px-2 text-bone-dim hover:text-red-400"
                aria-label="크레딧 삭제"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 스틸 드롭존 */}
      <div className="mt-5">
        <span className="label">색보정 스틸 (드래그 드롭 · 자동 압축)</span>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            onFiles(e.dataTransfer.files);
          }}
          onClick={() => fileRef.current?.click()}
          className={`mt-2 cursor-pointer rounded-sm border border-dashed p-6 text-center text-sm transition ${
            drag ? "border-accent-warm bg-accent-warm/5 text-bone" : "border-ink-line text-bone-faint hover:border-bone-dim"
          }`}
        >
          이미지를 여기로 드래그하거나 클릭해서 선택 (비율 무관)
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {work.stills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {work.stills.map((s, si) => (
              <div key={s.src + si} className="relative h-20 overflow-hidden rounded-sm bg-ink-soft ring-1 ring-ink-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt="" className="h-20 w-auto object-cover" />
                <button
                  type="button"
                  onClick={() => onChange({ stills: work.stills.filter((_, k) => k !== si) })}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-bone hover:bg-black"
                  aria-label="스틸 삭제"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

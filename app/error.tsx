"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 text-center">
      <div>
        <p className="eyebrow">Error</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          문제가 발생했습니다
        </h1>
        <p className="mt-3 text-sm text-bone-dim">
          잠시 후 다시 시도해 주세요.
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-block rounded-sm bg-bone px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-accent-warm"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm text-bone-dim">
          주소가 변경되었거나 존재하지 않는 페이지입니다.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-sm bg-bone px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-accent-warm"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}

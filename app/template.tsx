// 라우트가 바뀔 때마다 새 페이지가 부드럽게 페이드인 (페이지 전환)
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}

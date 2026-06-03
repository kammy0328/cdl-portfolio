/** @type {import('next').NextConfig} */
const nextConfig = {
  // YouTube 썸네일을 외부에서 직접 불러오는 경우를 허용
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  // ESLint를 빌드에 포함 — 오류 시 빌드 실패(경고는 통과). 단독 실행: npm run lint
  eslint: { ignoreDuringBuilds: false, dirs: ["app", "components", "lib"] },
};

export default nextConfig;

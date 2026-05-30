/** @type {import('next').NextConfig} */
const nextConfig = {
  // YouTube 썸네일을 외부에서 직접 불러오는 경우를 허용
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  // 빌드 시 ESLint 검사로 인한 배포 실패 방지 (타입 검사는 그대로 유지)
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

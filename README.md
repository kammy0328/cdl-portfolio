# CDL — 색보정 포트폴리오

원격(온라인)으로 작업하는 컬러리스트 **CDL**의 포트폴리오 사이트입니다.
Next.js + Tailwind CSS로 제작되었고 Vercel로 배포됩니다.

---

## 🚀 로컬에서 실행하기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

---

## 📝 콘텐츠 추가/수정 (가장 중요)

거의 모든 내용은 **`data/works.ts`** 파일 하나만 수정하면 됩니다.

### 1) 새 작업(영상) 추가

`works` 배열에 항목을 하나 추가하세요. 사이트는 `publishedAt`(유튜브 업로드
날짜) 기준으로 **자동 최신순 정렬**됩니다.

```ts
{
  slug: "artist-song",            // URL 주소 (영문/숫자/하이픈)
  title: "노래 제목",
  artist: "아티스트 이름",
  category: "Music Video",        // 분류
  youtubeId: "XXXXXXXXXXX",       // youtu.be/XXXX 의 XXXX 부분
  publishedAt: "2026-06-01",      // 유튜브 업로드 날짜 (YYYY-MM-DD)
  description: "",                // 한 줄 소개 (선택)
  credits: [ ... ],               // 아래 참고
  stills: [ ... ],                // 아래 참고
}
```

### 2) 크레딧 추가 (없어도 되고, 길어도 됨)

`credits` 배열에 `{ role, name }` 을 원하는 만큼 추가합니다. 비우면 `[]`.

```ts
credits: [
  { role: "감독", name: "홍길동" },
  { role: "촬영감독", name: "김촬영" },
  { role: "편집", name: "이편집" },
  { role: "색보정", name: "CDL" },
]
```

### 3) 색보정 스틸 추가

1. 이미지 파일을 **`public/stills/<slug>/`** 폴더에 넣습니다.
   (예: `public/stills/artist-song/still-01.jpg`)
2. `stills` 배열에 경로를 추가합니다. 비우면 `[]`.

```ts
stills: [
  "/stills/artist-song/still-01.jpg",
  "/stills/artist-song/still-02.jpg",
]
```

> 갤러리 페이지(`/gallery`)에는 모든 작업의 스틸이 자동으로 모여 **매 방문마다
> 무작위 순서**로 표시됩니다.

> ⚠️ 현재 들어있는 스틸은 유튜브 영상에서 추출한 임시 프레임입니다.
> 실제 색보정 스틸로 교체해 주세요.

---

## ✉️ 문의 메일 받기 (Resend 설정)

문의 폼은 **설정 없이도 동작**합니다. 환경변수가 없으면 방문자의 메일 앱이
`cdlnolut@gmail.com` 수신자로 자동으로 열립니다.

**자동 전송(폼 제출 즉시 메일 수신)** 을 원하면 무료 서비스 Resend를 연결하세요.

1. https://resend.com 가입 (가입 이메일은 `cdlnolut@gmail.com` 권장 — 도메인
   인증 없이도 본인 메일로 수신 가능)
2. **API Keys** 메뉴에서 키 발급 (`re_...`)
3. Vercel 프로젝트 → **Settings → Environment Variables** 에 추가:
   - Name: `RESEND_API_KEY`
   - Value: 발급받은 키
4. 재배포(Redeploy) 하면 끝.

> 나중에 본인 도메인을 Resend에 인증하면 `app/api/contact/route.ts` 의
> `from` 주소를 본인 도메인 메일로 바꿀 수 있습니다.

---

## 🛠 사이트 기본 정보 수정

이름, 이메일, 인스타그램, 도메인 등은 **`lib/site.ts`** 에서 한 번에 관리합니다.

---

## ☁️ 배포

GitHub 저장소가 Vercel에 연결되어 있어, `main` 브랜치에 **푸시하면 자동으로
재배포**됩니다.

```bash
git add .
git commit -m "콘텐츠 업데이트"
git push
```

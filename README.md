# CDL — 색보정 포트폴리오

원격(온라인) 컬러리스트 **CDL**의 포트폴리오. Next.js + Tailwind, Vercel 배포,
콘텐츠는 **관리자 페이지(/admin)** 에서 관리하고 Vercel Blob에 저장됩니다.

- 라이브: https://cdl-portfolio.vercel.app
- 관리자: https://cdl-portfolio.vercel.app/admin

---

## 🔐 1) 관리자 비밀번호 설정 (처음 한 번만)

관리자 페이지는 비밀번호로 보호됩니다. **본인이 직접** 비밀번호를 정하세요.

```bash
# 비밀번호를 Vercel 환경변수로 등록 (입력 프롬프트에 원하는 비밀번호 입력)
vercel env add ADMIN_PASSWORD
#   ? What's the value? ****  (원하는 비밀번호)
#   ? Add to which Environments?  → Production, Preview, Development 모두 선택

# 적용을 위해 재배포
vercel --prod
```

> 대시보드에서 해도 됩니다: Vercel → 프로젝트 → Settings → Environment Variables →
> `ADMIN_PASSWORD` 추가 → Redeploy. 비밀번호는 절대 코드에 적지 마세요.

설정 후 `/admin` 에 접속하면 로그인 화면이 나타납니다.

---

## 📤 2) 포트폴리오 관리 (/admin)

로그인하면:

- **작업 추가/삭제/순서 변경**
- **유튜브 URL/ID 입력 → “불러오기”** : 제목·아티스트·업로드 날짜 자동 채움
  (정렬은 업로드 날짜 최신순으로 자동)
- **크레딧**: 직무·이름을 원하는 만큼 추가 (없어도 됨)
- **색보정 스틸**: 영역에 **드래그 드롭** 또는 클릭해서 선택
  - 업로드 시 **자동으로 WebP 변환 + 화질 유지하며 용량 축소** (긴 변 최대 2400px)
  - **비율 무관** (16:9·4:3·9:16 세로 등) — 갤러리/작업 페이지에 여백 없이 자동 배치
- **저장**을 누르면 사이트에 **즉시 반영**됩니다.

---

## ✉️ 3) 문의 자동 수신 (선택 · Resend)

문의 폼은 설정 없이도 동작합니다(방문자 메일 앱이 열림). 즉시 메일 수신을 원하면:

1. https://resend.com 가입 (가입 메일은 `cdlnolut@gmail.com` 권장)
2. API Key 발급 → Vercel 환경변수 `RESEND_API_KEY` 추가 → 재배포

---

## 🗂 데이터/저장소 구조 (참고)

- **Vercel Blob (`cdl-stills`)**: `works.json`(포트폴리오 데이터) + 업로드된 스틸 이미지.
- **`data/works.ts`**: 초기 시드 / 대체용. Blob에 데이터가 없거나 오류일 때 사용됩니다.
- 환경변수: `BLOB_READ_WRITE_TOKEN`(자동), `ADMIN_PASSWORD`(직접 설정), `RESEND_API_KEY`(선택).

---

## 🛠 로컬 실행 / 배포

```bash
npm install
npm run build        # 빌드
# (이 NAS 환경에선 npm run dev가 멈출 수 있어, 미리보기는 Vercel 배포본으로 확인)

git add . && git commit -m "..." && git push   # main 푸시 시 자동 재배포
```

사이트 기본 정보(이름/이메일/인스타/도메인)는 `lib/site.ts` 에서 관리합니다.

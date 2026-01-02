# Personal About Site (Next.js)

이 저장소는 Vercel에 배포하기 위한 Next.js 기반의 개인 소개 페이지입니다. Tailwind CSS로 스타일링되었으며, 프로젝트 하이라이트와 연락처 정보를 포함합니다.

## 개발 서버 실행

1. 의존성 설치
   ```bash
   npm install
   ```

2. 개발 서버 시작
   ```bash
   npm run dev
   ```

브라우저에서 http://localhost:3000 으로 접속하세요.

## 배포 및 환경 변수 설정

### Vercel (Next.js 프론트엔드)

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL (`https://xxxx.supabase.co` 형태)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키. 클라이언트에서 Edge Function 호출 시 사용합니다.

두 변수를 Vercel Dashboard > Project Settings > Environment Variables에 추가하면 빌드와 런타임 모두에서 동작합니다.

### Supabase Edge Function 시크릿(권장)

Supabase CLI로 Edge Function에 필요한 키를 설정해 주세요.

```bash
supabase functions secrets set OPENAI_API_KEY=sk-...
supabase functions secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase functions secrets set SUPABASE_URL=https://xxxx.supabase.co
```

- `generate-copies` 함수에서 OpenAI API를 호출하고 DB에서 데이터셋을 읽습니다.
- `track-selection` 함수에서 선택 이력을 `selection_history` 테이블에 저장합니다.

### 동작 방식 요약

1. 사용자가 아이디어를 입력하면 `generate-copies` Edge Function을 호출합니다.
2. 함수는 데이터셋/패턴을 조회하고 OpenAI ChatGPT API로 5개 문구를 생성합니다. (실패 시 프론트엔드에서 샘플 패턴으로 대체 생성)
3. 결과와 `generationId`를 sessionStorage에 저장하고 `/result` 페이지에서 노출합니다.
4. 카드 선택 시 `track-selection` 함수로 `generationId`, `selectedIndex`, `clientSessionId`를 전달해 히스토리에 남깁니다.

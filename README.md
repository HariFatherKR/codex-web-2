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

### Supabase DB & Edge Functions 배포 절차

1. **스키마/시드 적용**: `supabase/sql/schema.sql`을 Supabase SQL Editor나 `psql`로 실행해 테이블, RLS 정책, 초기 데이터셋을 생성합니다.
   ```bash
   psql "$SUPABASE_DB_URL" -f supabase/sql/schema.sql
   ```

2. **Edge Function 배포**: Vercel/프론트엔드에서 호출할 `generate-copies`, `track-selection` 함수를 Supabase에 올립니다.
   ```bash
   supabase functions deploy generate-copies --project-ref <YOUR_REF>
   supabase functions deploy track-selection --project-ref <YOUR_REF>
   ```

3. **시크릿 설정(필수)**: 서비스 역할 키와 OpenAI 키를 Edge Function에 주입합니다.
   ```bash
   supabase functions secrets set --project-ref <YOUR_REF> \
     OPENAI_API_KEY=sk-... \
     SUPABASE_SERVICE_ROLE_KEY=... \
     SUPABASE_URL=https://xxxx.supabase.co
   ```

4. **로컬 테스트**: Supabase CLI emulation 환경에서 호출해 봅니다.
   ```bash
   supabase functions serve generate-copies --env-file .env.local
   supabase functions serve track-selection --env-file .env.local
   ```

> `supabase/functions/*` 디렉터리의 TypeScript 코드는 Supabase Edge Runtime(Deno)용입니다. Vercel에는 따로 올릴 필요 없으며, 프론트엔드(`NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`)에서 Edge Function만 호출하면 됩니다.

### 동작 방식 요약

1. 사용자가 아이디어를 입력하면 `generate-copies` Edge Function을 호출합니다.
2. 함수는 데이터셋/패턴을 조회하고 OpenAI ChatGPT API로 5개 문구를 생성합니다. (실패 시 프론트엔드에서 샘플 패턴으로 대체 생성)
3. 결과와 `generationId`를 sessionStorage에 저장하고 `/result` 페이지에서 노출합니다.
4. 카드 선택 시 `track-selection` 함수로 `generationId`, `selectedIndex`, `clientSessionId`를 전달해 히스토리에 남깁니다.

-- Supabase schema for marketing copy generator
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1) copy_datasets holds reusable patterns and tone guides
create table if not exists public.copy_datasets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  locale text not null default 'ko-KR',
  version int not null default 1,
  channels jsonb not null,
  updated_at timestamptz not null default now(),
  unique(locale, version)
);

-- 2) generations records every generation call (optional but recommended)
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  idea text not null,
  channel_mix text,
  dataset_id uuid references public.copy_datasets(id),
  result jsonb,
  request_meta jsonb
);

-- 3) selection_history stores which copy the user picked
create table if not exists public.selection_history (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  generation_id uuid references public.generations(id),
  selected_index int not null,
  selected_item jsonb not null,
  idea text not null,
  client_session_id text
);

-- Enable RLS on all tables
alter table public.copy_datasets enable row level security;
alter table public.generations enable row level security;
alter table public.selection_history enable row level security;

-- Policies: only service_role can write; copy_datasets can be read publicly (or tighten if desired)
create policy "copy_datasets_select_public" on public.copy_datasets for select using (true);
create policy "copy_datasets_no_public_write" on public.copy_datasets for insert with check (false);
create policy "copy_datasets_no_public_update" on public.copy_datasets for update using (false);
create policy "copy_datasets_no_public_delete" on public.copy_datasets for delete using (false);

create policy "generations_insert_service_role" on public.generations
  for insert
  with check (auth.role() = 'service_role');
create policy "generations_select_service_role" on public.generations
  for select
  using (auth.role() = 'service_role');

create policy "selection_history_insert_service_role" on public.selection_history
  for insert
  with check (auth.role() = 'service_role');
create policy "selection_history_select_service_role" on public.selection_history
  for select
  using (auth.role() = 'service_role');

-- Seed a default dataset with Korean channel guides
insert into public.copy_datasets (name, locale, version, channels)
values
  (
    'Default Copy Patterns KR',
    'ko-KR',
    1,
    '{
      "SNS": {
        "toneGuide": "공감/캐주얼/짧은 문장",
        "lengthGuide": "1~3문장",
        "pattern": ["problem", "solution", "benefit", "socialProof", "scarcity", "cta"],
        "examples": {
          "problem": ["매일 할 일을 미루게 된다면?"],
          "solution": ["3분 만에 오늘의 우선순위를 정리하세요."],
          "benefit": ["하루가 선명해집니다."],
          "socialProof": ["10만+ 유저의 후기"],
          "scarcity": ["이번 주 신규 가입 한정"] ,
          "cta": ["지금 무료로 시작"]
        }
      },
      "BANNER": {
        "toneGuide": "직설/혜택",
        "lengthGuide": "1~2줄",
        "pattern": ["problem", "solution", "benefit", "cta"],
        "examples": {
          "problem": ["복잡한 일정 관리, 힘드시죠?"],
          "solution": ["자동 리마인더로 깔끔하게"],
          "benefit": ["놓침 없이 끝낸다"],
          "socialProof": [""],
          "scarcity": [""],
          "cta": ["무료 체험"]
        }
      },
      "LANDING": {
        "toneGuide": "신뢰/설득/서술형",
        "lengthGuide": "2~5문장",
        "pattern": ["problem", "solution", "benefit", "socialProof", "scarcity", "cta"],
        "examples": {
          "problem": ["팀 전체가 제때 일을 끝내지 못해 답답한가요?"],
          "solution": ["프로젝트별 자동 워크플로우로 흐름을 잡아드립니다."],
          "benefit": ["회의 횟수는 줄이고, 결과는 더 빨라집니다."],
          "socialProof": ["3,200개 기업이 재구매"],
          "scarcity": ["이번 분기 온보딩 마감 임박"],
          "cta": ["데모 신청"]
        }
      }
    }'::jsonb
  )
  on conflict (locale, version) do nothing;

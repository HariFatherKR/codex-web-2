'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Send, Wand2 } from 'lucide-react';

const suggestionChips = ['브랜드명:', '타겟:', '혜택:', '제품:'];

const placeholderSamples = [
  '브랜드명: 필라핏 | 타겟: 직장인 | 혜택: 10분 루틴 | 아이디어: 퇴근 후 운동',
  '브랜드명: 루프워크 | 타겟: 스타트업 팀 | 혜택: 자동화 | 아이디어: 업무 단축',
  '브랜드명: 소프트글로우 | 타겟: 민감성 피부 | 혜택: 진정 | 아이디어: 세럼',
  '브랜드명: 플랜잇 | 타겟: 친구들 | 혜택: 가성비 일정 | 아이디어: 주말 여행',
];

const hintMessages = [
  '브랜드명을 넣으면 더 “내 문구”처럼 보여요.',
  '할인/무료/시간절약 같은 혜택을 1개만 추가해보세요.',
  '타겟을 한 단어라도 적으면 더 잘 맞는 카피가 나옵니다.',
];

type ChatInputBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  minLength?: number;
  maxLength?: number;
};

export function ChatInputBar({ value, onChange, onSubmit, loading, minLength = 5, maxLength = 300 }: ChatInputBarProps) {
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState('브랜드명: 필라핏 | 타겟: 직장인 | 혜택: 10분 루틴 | 아이디어: ...');

  useEffect(() => {
    setPlaceholder(placeholderSamples[Math.floor(Math.random() * placeholderSamples.length)]);
  }, []);

  const hint = useMemo(() => hintMessages[Math.floor(Math.random() * hintMessages.length)], []);

  const handleSubmit = () => {
    if (loading) return;
    if (value.trim().length < minLength) {
      setError(`최소 ${minLength}자 이상 입력해주세요.`);
      return;
    }
    if (value.length > maxLength) {
      setError(`최대 ${maxLength}자까지 입력 가능합니다.`);
      return;
    }
    setError(null);
    onSubmit();
  };

  const handleChipClick = (chip: string) => {
    if (!value.includes(chip)) {
      onChange(value.length ? `${value} ${chip} ` : `${chip} `);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-800/70 bg-slate-950/85 backdrop-blur safe-bottom">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 font-semibold text-slate-100">
            <Wand2 size={14} />
            힌트
          </span>
          <span>{hint}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="rounded-full border border-slate-800/90 bg-slate-900/60 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:text-white"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="card-surface flex gap-3 p-4 shadow-soft">
          <textarea
            className="h-24 w-full resize-none rounded-2xl bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            disabled={loading}
            aria-label="문구 생성"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Enter 전송 · Shift + Enter 줄바꿈</span>
          <span>
            {value.length}/{maxLength}
          </span>
        </div>
        {error && <p className="text-sm font-semibold text-rose-300">{error}</p>}
      </div>
    </div>
  );
}

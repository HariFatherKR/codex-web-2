'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatInputBar } from '@/components/ChatInputBar';
import { requestCopies } from '@/lib/api';
import { STORAGE_KEYS, getOrCreateClientSessionId, getSessionValue, setSessionValue } from '@/lib/storage';
import { type CopyItem } from '@/types/copy';

const channelTips = [
  {
    label: 'SNS',
    text: '공감과 가벼운 전환을 노리는 톤. 상황 묘사와 감정을 살려요.',
  },
  {
    label: 'BANNER',
    text: '숫자와 혜택을 바로 던지는 짧은 카피. CTA가 가장 강합니다.',
  },
  {
    label: 'LANDING',
    text: '논리적인 흐름과 신뢰를 강조한 톤. 문제 → 해결 → 혜택 순서를 살립니다.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [clientSessionId, setClientSessionId] = useState('');

  useEffect(() => {
    const savedIdea = getSessionValue<string>(STORAGE_KEYS.idea, '');
    if (savedIdea) setIdea(savedIdea);
    const existingSession = getOrCreateClientSessionId();
    setClientSessionId(existingSession);
  }, []);

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    setStatus('데이터셋을 불러오고 있어요...');

    const recentIds = getSessionValue<string[]>(STORAGE_KEYS.recentIds, []);

    try {
      const sessionId = clientSessionId || getOrCreateClientSessionId();
      const response = await requestCopies(idea, sessionId, recentIds);

      const nextRecent = [
        ...recentIds,
        ...response.items.map((item) => item.patternId).filter(Boolean),
      ].slice(-15) as string[];

      setSessionValue(STORAGE_KEYS.idea, idea);
      setSessionValue<CopyItem[]>(STORAGE_KEYS.results, response.items);
      setSessionValue<string | null>(STORAGE_KEYS.generationId, response.generationId);
      setSessionValue(STORAGE_KEYS.selectedIndex, null);
      setSessionValue(STORAGE_KEYS.recentIds, nextRecent);

      setStatus(
        response.usedFallback
          ? 'OpenAI 호출이 지연되어 샘플 패턴으로 생성했어요.'
          : '완료! 결과 페이지로 이동합니다'
      );
      router.push('/result');
    } catch (error) {
      const message = error instanceof Error ? error.message : '문구 생성 중 오류가 발생했어요.';
      setStatus(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-100">
          <Sparkles size={14} />
          Supabase Edge Function · OpenAI 연동
        </div>
        <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">카피라이팅 패턴 문구 생성기</h1>
        <p className="text-base text-slate-300 sm:text-lg">
          문제 → 해결 → 혜택 → 사회적 증거 → CTA 5단계를 유지한 채, 채널별 톤과 길이를 조절한 5개 문구를 만들어 드려요.
        </p>
        {status && <p className="text-sm text-indigo-200">{status}</p>}
      </header>

      <section className="card-surface divide-y divide-slate-800/60 overflow-hidden shadow-soft">
        <div className="grid gap-4 px-5 py-6 sm:grid-cols-[1.1fr,0.9fr] sm:px-6 sm:py-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">어떻게 작동하나요?</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-indigo-300" size={18} />
                <span>입력에서 문제/타겟/혜택/제품 키워드를 추출해 슬롯을 채웁니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-indigo-300" size={18} />
                <span>채널별 패턴(SNS/배너/랜딩) 중 키워드가 맞는 샘플을 점수화해 고릅니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-indigo-300" size={18} />
                <span>항상 문제 → 해결 → 혜택 → 사회적 증거 → CTA 흐름을 유지한 문단을 조합합니다.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <Timer size={16} /> 가이드
            </div>
            <ol className="mt-3 space-y-2 text-sm text-slate-300">
              <li>1) 아이디어를 한 줄로 적고 Enter를 눌러요.</li>
              <li>2) Supabase Edge Function(generate-copies)에서 DB 패턴과 OpenAI를 조합해 5개 문구를 반환합니다.</li>
              <li>3) 마음에 드는 카드를 선택하면 track-selection으로 기록돼요.</li>
            </ol>
          </div>
        </div>
        <div className="grid gap-4 px-5 py-6 sm:grid-cols-3 sm:px-6 sm:py-7">
          {channelTips.map((channel) => (
            <div key={channel.label} className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 text-sm text-slate-200">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-100">
                {channel.label}
                <ArrowRight size={14} />
              </div>
              <p className="leading-relaxed text-slate-300">{channel.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-3 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-soft">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">Session Storage</p>
            <h3 className="text-lg font-semibold text-white">URL 이동 없이 상태를 유지해요</h3>
          </div>
          <span className="text-xs text-slate-400">idea/items/generationId를 sessionStorage에 저장하고 clientSessionId는 localStorage에 보관합니다.</span>
        </div>
        <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
          <p>입력값을 그대로 저장해 새로고침해도 다시 쓸 수 있어요.</p>
          <p>clientSessionId는 Edge Function 호출마다 재사용돼 히스토리와 연결됩니다.</p>
        </div>
      </section>

      <ChatInputBar value={idea} onChange={setIdea} onSubmit={handleGenerate} loading={loading} />
    </div>
  );
}

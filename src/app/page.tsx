'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatInputBar } from '@/components/ChatInputBar';
import { generateFromSamples, type GeneratedCopy } from '@/lib/generateFromSamples';
import { STORAGE_KEYS, getSessionValue, setSessionValue } from '@/lib/storage';

const toneTips = [
  { label: '밝고 캐주얼', text: '친근하고 가벼운 캠페인이나 SNS용으로 잘 어울려요.' },
  { label: '신뢰감/전문', text: 'B2B, 금융, 의료 등 신뢰가 중요한 상황에 적합해요.' },
  { label: '감성/스토리', text: '브랜드 스토리나 고객 후기처럼 서정적인 톤이 필요할 때.' },
  { label: '퍼포먼스/직접', text: '전환을 노리는 랜딩/광고 문구에 바로 써먹을 수 있어요.' },
  { label: '미니멀/직관', text: '짧고 빠른 메시지가 필요한 배너나 푸시에 적합합니다.' },
];

export default function HomePage() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const savedIdea = getSessionValue<string>(STORAGE_KEYS.idea, '');
    if (savedIdea) setIdea(savedIdea);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setStatus('샘플을 찾는 중입니다...');

    const delay = 650 + Math.random() * 550;
    const recentIds = getSessionValue<string[]>(STORAGE_KEYS.recentIds, []);

    const timer = setTimeout(() => {
      setStatus('타이핑 효과를 준비하는 중...');
    }, 450);

    const selectedCopies: GeneratedCopy[] = generateFromSamples(idea, recentIds);

    setTimeout(() => {
      clearTimeout(timer);
      setSessionValue(STORAGE_KEYS.idea, idea);
      setSessionValue(STORAGE_KEYS.results, selectedCopies);
      setSessionValue(STORAGE_KEYS.selectedIndex, null);
      const nextRecent = [...recentIds, ...selectedCopies.map((copy) => copy.sampleId)].slice(-15);
      setSessionValue(STORAGE_KEYS.recentIds, nextRecent);
      setLoading(false);
      setStatus('완료! 결과 페이지로 이동합니다');
      router.push('/result');
    }, delay);
  };

  return (
    <div className="page-shell">
      <header className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-100">
          <Sparkles size={14} />
          샘플 데이터 기반 · 서버 호출 없이 동작
        </div>
        <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">AI처럼 보이는 문구 생성기</h1>
        <p className="text-base text-slate-300 sm:text-lg">
          로컬에 담긴 200개 이상의 샘플 문구를 섞어 5개 톤으로 결과를 보여줍니다. 입력값은 sessionStorage에
          저장되어 새로고침해도 유지돼요.
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
                <span>입력에서 브랜드/타겟/혜택 단어를 간단히 추출해 슬롯을 채웁니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-indigo-300" size={18} />
                <span>키워드 매칭 점수가 높은 샘플을 골라 톤별로 다른 문구를 뽑아요.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-indigo-300" size={18} />
                <span>최근 사용한 샘플 ID를 sessionStorage에 저장해 반복 노출을 줄입니다.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <Timer size={16} /> 가이드
            </div>
            <ol className="mt-3 space-y-2 text-sm text-slate-300">
              <li>1) 아이디어를 한 줄로 적고 Enter를 눌러요.</li>
              <li>2) 0.6~1.2초 가짜 로딩 후 결과 5개가 생성됩니다.</li>
              <li>3) 마음에 드는 카드를 선택하고 복사하거나 메인으로 돌아갑니다.</li>
            </ol>
          </div>
        </div>
        <div className="grid gap-4 px-5 py-6 sm:grid-cols-5 sm:px-6 sm:py-7">
          {toneTips.map((tone) => (
            <div key={tone.label} className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 text-sm text-slate-200">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-100">
                {tone.label}
                <ArrowRight size={14} />
              </div>
              <p className="leading-relaxed text-slate-300">{tone.text}</p>
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
          <span className="text-xs text-slate-400">idea/items/selectedIndex를 sessionStorage에 저장합니다.</span>
        </div>
        <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
          <p>입력값을 그대로 저장해 새로고침해도 다시 쓸 수 있어요.</p>
          <p>최근 노출된 샘플 ID를 함께 저장해 같은 문구 반복을 줄입니다.</p>
        </div>
      </section>

      <ChatInputBar value={idea} onChange={setIdea} onSubmit={handleGenerate} loading={loading} />
    </div>
  );
}

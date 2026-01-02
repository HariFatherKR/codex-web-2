'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ClipboardCheck, Home } from 'lucide-react';
import { CopyCard } from '@/components/CopyCard';
import { type GeneratedCopy } from '@/lib/generateFromSamples';
import { STORAGE_KEYS, getSessionValue, setSessionValue } from '@/lib/storage';

export default function ResultPage() {
  const [idea, setIdea] = useState('');
  const [copies, setCopies] = useState<GeneratedCopy[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    const storedIdea = getSessionValue<string>(STORAGE_KEYS.idea, '');
    const stored = getSessionValue<GeneratedCopy[]>(STORAGE_KEYS.results, []);
    const storedIndex = getSessionValue<number | null>(STORAGE_KEYS.selectedIndex, null);

    if (!stored.length) {
      window.location.href = '/';
      return;
    }

    setIdea(storedIdea);
    setCopies(stored);
    setSelectedIndex(storedIndex);
  }, []);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setSessionValue(STORAGE_KEYS.selectedIndex, index);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage('클립보드에 복사되었습니다');
      setTimeout(() => setCopyMessage(''), 1500);
    } catch (error) {
      setCopyMessage('복사에 실패했어요. 다시 시도해주세요.');
      setTimeout(() => setCopyMessage(''), 2000);
    }
  };

  return (
    <div className="page-shell">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-100">
            <ClipboardCheck size={14} />
            톤별 문구 5개 준비 완료
          </div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">결과 확인</h1>
          {idea && <p className="text-sm text-slate-300">입력: {idea}</p>}
          {selectedIndex !== null && (
            <p className="flex items-center gap-2 text-sm font-semibold text-indigo-200">
              <CheckCircle2 size={16} /> 선택된 카드가 저장되었습니다.
            </p>
          )}
          {copyMessage && <p className="text-sm text-emerald-200">{copyMessage}</p>}
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400 hover:text-white"
        >
          <Home size={16} /> 메인으로 돌아가기
        </Link>
      </header>

      <div className="space-y-4">
        {copies.map((copy, index) => (
          <CopyCard
            key={`${copy.sampleId}-${copy.tone}`}
            tone={copy.tone}
            text={copy.text}
            selected={selectedIndex === index}
            onSelect={() => handleSelect(index)}
            onCopy={() => handleCopy(copy.text)}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-400">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/60 px-4 py-2 font-semibold text-slate-100 transition hover:border-indigo-400 hover:text-white"
        >
          <ArrowLeft size={14} />
          메인으로 돌아가기
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/60 px-4 py-2">
          <span className="text-xs uppercase tracking-[0.18em] text-indigo-200">Tip</span>
          <span className="text-slate-300">선택된 카드 번호가 sessionStorage에 저장돼요.</span>
        </div>
      </div>
    </div>
  );
}

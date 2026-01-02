'use client';

import { Check, Copy, Palette } from 'lucide-react';
import { type Channel } from '@/data/copyPatterns';

const channelColors: Record<Channel, string> = {
  SNS: 'bg-indigo-500/15 text-indigo-200 border-indigo-400/30',
  BANNER: 'bg-amber-500/15 text-amber-100 border-amber-400/30',
  LANDING: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
};

type CopyCardProps = {
  channel: Channel;
  text: string;
  selected?: boolean;
  onSelect?: () => void;
  onCopy?: () => void;
};

export function CopyCard({ channel, text, selected, onSelect, onCopy }: CopyCardProps) {
  const highlightClass = selected ? 'ring-2 ring-indigo-400' : '';
  const borderClass = selected ? 'border-indigo-400/70' : 'border-slate-800/60';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full text-left transition hover:-translate-y-1 hover:border-indigo-400 ${highlightClass}`}
    >
      <div className={`card-surface flex h-full flex-col gap-4 border ${borderClass} p-4 sm:p-5`}>
        <div className="flex items-center justify-between gap-3">
          <div className={`tone-pill border ${channelColors[channel]} inline-flex items-center gap-2`}>
            <Palette size={14} />
            {channel}
          </div>
          {selected && (
            <span className="flex items-center gap-1 text-xs font-semibold text-indigo-200">
              <Check size={14} /> 선택 완료
            </span>
          )}
        </div>
        <p className="flex-1 text-base leading-relaxed text-slate-100 sm:text-lg">{text}</p>
        <div className="flex justify-end">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onCopy?.();
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-slate-700"
          >
            <Copy size={14} /> 복사
          </span>
        </div>
      </div>
    </button>
  );
}

import { copyPatterns, type Channel, type CopyPattern } from '@/data/copyPatterns';
import { type CopyItem } from '@/types/copy';

const FALLBACK_SLOTS = {
  문제: '시간이 모자라 목표를 놓치는 것',
  타겟: '당신',
  제품: '이 서비스',
  해결책: '이 서비스',
  혜택: '더 빠른 결과',
};

const NUMBER_POOL = ['1,000', '5,000', '10,000', '25,000'];

const FALLBACK_TONE: Record<Channel, string> = {
  SNS: '공감/캐주얼',
  BANNER: '직설/혜택',
  LANDING: '신뢰/설득',
};

type ParsedSlots = Partial<typeof FALLBACK_SLOTS>;

type SlotKey = keyof typeof FALLBACK_SLOTS | '숫자';

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const targetKeywords = ['직장인', '학생', '초보', '1인마케터', '부모', '여행객', '개발자'];
const benefitKeywords = ['할인', '무료', '10분', '빠르게', '간편', '시간', '절약', '무상', '체험'];

function extractValue(input: string, label: string) {
  const regex = new RegExp(`${label}\s*[:：]\s*([^|\n]+)`, 'i');
  const match = input.match(regex);
  return match?.[1]?.trim();
}

function parseSlots(input: string): ParsedSlots {
  const slots: ParsedSlots = {};
  const product = extractValue(input, '제품|서비스|product');
  const target = extractValue(input, '타겟|대상|target');
  const benefit = extractValue(input, '혜택|benefit');
  const problem = extractValue(input, '문제|pain|problem');

  if (product) slots.제품 = product;
  if (target) slots.타겟 = target;
  if (benefit) slots.혜택 = benefit;
  if (problem) slots.문제 = problem;

  const normalized = normalize(input);
  targetKeywords.forEach((keyword) => {
    if (normalized.includes(normalize(keyword)) && !slots.타겟) {
      slots.타겟 = keyword;
    }
  });

  benefitKeywords.forEach((keyword) => {
    if (normalized.includes(normalize(keyword)) && !slots.혜택) {
      slots.혜택 = keyword;
    }
  });

  if (!slots.문제) {
    const firstPhrase = input.split(/[,\.]/)[0]?.trim();
    if (firstPhrase) {
      slots.문제 = firstPhrase;
    }
  }

  return slots;
}

function scorePattern(inputWords: string[], pattern: CopyPattern) {
  const matches = pattern.keywords.reduce((score, keyword) => {
    return inputWords.includes(normalize(keyword)) ? score + 1 : score;
  }, 0);
  return matches;
}

function replaceSlots(text: string, slots: ParsedSlots & { 숫자: string }) {
  return text.replace(/\{(문제|타겟|제품|해결책|혜택|숫자)\}/g, (match, key: SlotKey) => {
    if (key === '숫자') return slots.숫자;
    const value = slots[key as keyof ParsedSlots] || FALLBACK_SLOTS[key as keyof ParsedSlots];
    if (key === '해결책' && !slots.해결책) return slots.제품 || FALLBACK_SLOTS.제품;
    return value;
  });
}

function pickRandom<T>(list: T[]) {
  if (!list.length) return undefined;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function buildCopyFromPattern(pattern: CopyPattern, slots: ParsedSlots): CopyItem | null {
  const withNumber = { ...slots, 숫자: pickRandom(NUMBER_POOL) ?? NUMBER_POOL[0] };
  const chosen = {
    problem: pickRandom(pattern.steps.problem),
    solution: pickRandom(pattern.steps.solution),
    benefit: pickRandom(pattern.steps.benefit),
    socialProof: pickRandom(pattern.steps.socialProof),
    cta: pickRandom(pattern.steps.cta),
  };

  if (!chosen.problem || !chosen.solution || !chosen.benefit || !chosen.socialProof || !chosen.cta) {
    return null;
  }

  const mergedSlots: ParsedSlots = {
    ...pattern.slots,
    ...slots,
    해결책: slots.해결책 || pattern.slots?.해결책 || slots.제품 || pattern.slots?.제품,
    제품: slots.제품 || pattern.slots?.제품,
    타겟: slots.타겟 || pattern.slots?.타겟,
    문제: slots.문제 || pattern.slots?.문제,
    혜택: slots.혜택 || pattern.slots?.혜택,
  };

  const text = replaceSlots(
    [chosen.problem, chosen.solution, chosen.benefit, chosen.socialProof, chosen.cta].join(' '),
    { ...mergedSlots, 숫자: withNumber.숫자 }
  );

  return {
    channel: pattern.channel,
    copy: text,
    tone: FALLBACK_TONE[pattern.channel],
    patternId: pattern.id,
  };
}

export function generateFromSamples(input: string, recentIds: string[] = []): CopyItem[] {
  const normalized = normalize(input);
  const words = normalized.split(' ');
  const slots = parseSlots(input);

  const ranked = copyPatterns
    .map((pattern) => ({
      pattern,
      score: scorePattern(words, pattern),
    }))
    .sort((a, b) => b.score - a.score);

  const topPool = ranked
    .filter((entry, index) => entry.score > 0 || index < 8)
    .map((entry) => entry.pattern)
    .slice(0, 12);

  const filtered = topPool.filter((pattern) => !recentIds.includes(pattern.id));
  const pool = filtered.length >= 5 ? filtered : topPool;

  const blueprint: Channel[] = ['SNS', 'BANNER', 'LANDING', 'SNS', 'BANNER'];
  const results: CopyItem[] = [];
  const used = new Set<string>();

  blueprint.forEach((channel) => {
    const candidates = pool.filter((pattern) => pattern.channel === channel && !used.has(pattern.id));
    const fallback = pool.filter((pattern) => !used.has(pattern.id));
    const selected = pickRandom(candidates.length ? candidates : fallback);

    if (!selected) return;

    used.add(selected.id);
    const built = buildCopyFromPattern(selected, slots);
    if (built) {
      results.push(built);
    }
  });

  return results;
}

import { copyBank, TONES, type CopyBankItem, type Tone } from '@/data/copyBank';

const FALLBACK_SLOTS = {
  brand: '우리',
  product: '서비스',
  target: '누구나',
  benefit: '더 쉽게',
};

type SlotKey = keyof CopyBankItem['slots'];

type ParsedSlots = Partial<Record<SlotKey, string>>;

export type GeneratedCopy = {
  tone: Tone;
  text: string;
  sampleId: string;
};

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
  const brand = extractValue(input, '브랜드명|brand');
  const product = extractValue(input, '제품|서비스|product');
  const target = extractValue(input, '타겟|대상|target');
  const benefit = extractValue(input, '혜택|benefit');

  if (brand) slots.brand = brand;
  if (product) slots.product = product;
  if (target) slots.target = target;
  if (benefit) slots.benefit = benefit;

  const normalized = normalize(input);
  targetKeywords.forEach((keyword) => {
    if (normalized.includes(normalize(keyword)) && !slots.target) {
      slots.target = keyword;
    }
  });

  benefitKeywords.forEach((keyword) => {
    if (normalized.includes(normalize(keyword)) && !slots.benefit) {
      slots.benefit = keyword;
    }
  });

  return slots;
}

function scoreSample(inputWords: string[], item: CopyBankItem) {
  const matches = item.keywords.reduce((score, keyword) => {
    return inputWords.includes(normalize(keyword)) ? score + 1 : score;
  }, 0);
  return matches;
}

function replaceSlots(text: string, slots: ParsedSlots) {
  return text.replace(/\{(brand|product|target|benefit)\}/g, (match, key: SlotKey) => {
    const value = slots[key] || FALLBACK_SLOTS[key];
    return value;
  });
}

function pickRandom<T>(list: T[]) {
  if (!list.length) return undefined;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function generateFromSamples(input: string, recentIds: string[] = []): GeneratedCopy[] {
  const normalized = normalize(input);
  const words = normalized.split(' ');
  const slots = parseSlots(input);

  const ranked = copyBank
    .map((item) => ({
      item,
      score: scoreSample(words, item),
    }))
    .sort((a, b) => b.score - a.score);

  const topPool = ranked
    .filter((entry) => entry.score > 0 || ranked.indexOf(entry) < 12)
    .map((entry) => entry.item)
    .slice(0, 18);

  const filtered = topPool.filter((item) => !recentIds.includes(item.id));
  const pool = filtered.length >= 6 ? filtered : topPool;

  const usedIds = new Set<string>();
  const results: GeneratedCopy[] = [];

  TONES.forEach((tone) => {
    const available = pool.filter((item) => !usedIds.has(item.id));
    const selectedSample = pickRandom(available.length ? available : pool);

    if (!selectedSample) return;

    usedIds.add(selectedSample.id);
    const candidate = pickRandom(selectedSample.copies[tone]);
    if (!candidate) return;

    results.push({
      tone,
      text: replaceSlots(candidate, { ...selectedSample.slots, ...slots }),
      sampleId: selectedSample.id,
    });
  });

  return results;
}

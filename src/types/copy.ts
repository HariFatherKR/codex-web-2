import { type Channel } from '@/data/copyPatterns';

export type CopyItem = {
  channel: Channel;
  copy: string;
  tone?: string;
  patternId?: string;
};

export type GenerationStore = {
  idea: string;
  items: CopyItem[];
  generationId: string | null;
};

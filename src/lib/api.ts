import { generateFromSamples } from './generateFromSamples';
import { generateCopies, isSupabaseConfigured, trackSelection } from './supabaseApi';
import { type CopyItem } from '@/types/copy';

export type GenerateResponse = {
  items: CopyItem[];
  generationId: string | null;
  usedFallback: boolean;
};

export async function requestCopies(
  idea: string,
  clientSessionId: string,
  recentIds: string[] = []
): Promise<GenerateResponse> {
  if (!idea.trim()) {
    throw new Error('아이디어를 입력해주세요.');
  }

  try {
    if (isSupabaseConfigured) {
      const data = await generateCopies({
        idea,
        locale: 'ko-KR',
        datasetVersion: 1,
        clientSessionId,
      });

      const mapped = ((data.items ?? []) as Array<CopyItem & { text?: string }>)
        .map((item) => ({
          channel: item.channel,
          copy: item.copy ?? item.text ?? '',
          tone: item.tone ?? undefined,
          patternId: item.patternId,
        }))
        .filter((item) => Boolean(item.channel) && Boolean(item.copy));

      if (mapped.length) {
        return {
          items: mapped as CopyItem[],
          generationId: (data.generationId as string | undefined) ?? null,
          usedFallback: false,
        } satisfies GenerateResponse;
      }
    }
  } catch (error) {
    console.warn('Supabase generate-copies 호출 실패, fallback으로 진행합니다.', error);
  }

  const fallbackItems = generateFromSamples(idea, recentIds);
  if (!fallbackItems.length) {
    throw new Error('샘플 기반 생성에도 실패했습니다. 입력을 다시 확인해주세요.');
  }

  return {
    items: fallbackItems,
    generationId: null,
    usedFallback: true,
  } satisfies GenerateResponse;
}

export async function sendSelection(params: {
  generationId: string | null;
  idea: string;
  selectedIndex: number;
  selectedItem: CopyItem;
  clientSessionId: string;
}) {
  if (!isSupabaseConfigured) {
    console.info('Supabase 미설정 상태 - selection 기록을 건너뜁니다.');
    return { ok: false, skipped: true } as const;
  }

  const response = await trackSelection({
    generationId: params.generationId,
    idea: params.idea,
    selectedIndex: params.selectedIndex,
    selectedItem: params.selectedItem,
    clientSessionId: params.clientSessionId,
  });

  return response;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

async function invokeFunction<T>(path: string, body: unknown): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'x-client-info': 'copy-generator-web',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase Edge Function 실패: ${response.status} ${message}`);
  }

  return response.json() as Promise<T>;
}

export async function generateCopies(body: {
  idea: string;
  locale?: string;
  datasetVersion?: number;
  clientSessionId: string;
}) {
  return invokeFunction<{ generationId?: string; items?: unknown[] }>('generate-copies', body);
}

export async function trackSelection(body: {
  generationId?: string | null;
  idea: string;
  selectedIndex: number;
  selectedItem: unknown;
  clientSessionId: string;
}) {
  return invokeFunction<{ ok: boolean }>('track-selection', body);
}

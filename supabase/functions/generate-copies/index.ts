import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "npm:openai";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.5";

type CopyItem = { channel: string; tone: string; copy: string };
type CopyDataset = {
  id: string;
  locale: string;
  version: number;
  channels: Record<
    string,
    {
      toneGuide: string;
      lengthGuide?: string;
      pattern: string[];
      examples: Record<string, string[]>;
    }
  >;
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const openaiApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const openai = new OpenAI({ apiKey: openaiApiKey });

async function fetchDataset(locale: string, datasetVersion?: number) {
  const query = supabase
    .from("copy_datasets")
    .select("id, locale, version, channels")
    .eq("locale", locale || "ko-KR")
    .order("version", { ascending: false })
    .limit(1);

  if (datasetVersion) {
    query.eq("version", datasetVersion);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data?.[0] as CopyDataset | undefined) ?? null;
}

function fallbackFromDataset(dataset: CopyDataset, idea: string): CopyItem[] {
  const entries = Object.entries(dataset.channels);
  return entries.slice(0, 5).map(([channel, cfg], index) => {
    const [problem = "", solution = "", benefit = "", socialProof = "", scarcity = "", cta = ""] = [
      cfg.examples.problem?.[0] ?? idea,
      cfg.examples.solution?.[0] ?? "",
      cfg.examples.benefit?.[0] ?? "",
      cfg.examples.socialProof?.[0] ?? "",
      cfg.examples.scarcity?.[0] ?? "",
      cfg.examples.cta?.[0] ?? "",
    ];

    const copy = [problem, solution, benefit, socialProof, scarcity, cta]
      .filter(Boolean)
      .join(" ");

    return {
      channel,
      tone: cfg.toneGuide ?? "",
      copy: copy || `${idea}를 위한 ${channel} 카피`,
    } satisfies CopyItem;
  });
}

async function generateWithOpenAI(dataset: CopyDataset, idea: string, locale: string) {
  if (!openaiApiKey) return null;

  const messages = [
    {
      role: "system" as const,
      content:
        "너는 한국어 마케팅 카피라이터이다. 제공된 채널별 패턴과 톤 가이드를 따라 5개의 문구를 JSON으로만 반환한다.",
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        locale,
        idea,
        requirements:
          "반드시 문제→해결→혜택→사회적증거→희소성→CTA 순서를 충족하고, 채널별 톤/길이를 지켜라. 과장된 표현 금지. JSON만 반환.",
        outputSchema: {
          items: [
            {
              channel: "SNS | BANNER | LANDING",
              tone: "채널별 톤",
              copy: "문구",
            },
          ],
        },
        dataset: dataset.channels,
      }),
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages,
    response_format: { type: "json_object" },
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content) as { items?: CopyItem[] };
  return parsed.items?.length ? parsed.items : null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const { idea, locale = "ko-KR", datasetVersion, clientSessionId } = await req.json();

  if (!idea || typeof idea !== "string" || idea.length < 4) {
    return new Response(JSON.stringify({ error: "idea is required and should be >= 4 chars" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const dataset = await fetchDataset(locale, datasetVersion);
  if (!dataset) {
    return new Response(JSON.stringify({ error: "dataset not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  let items: CopyItem[] | null = null;

  try {
    items = await generateWithOpenAI(dataset, idea, locale);
  } catch (error) {
    console.error("OpenAI generation failed", error);
  }

  if (!items || !items.length) {
    items = fallbackFromDataset(dataset, idea);
  }

  const { data: generationRow, error: insertError } = await supabase
    .from("generations")
    .insert({
      idea,
      channel_mix: Object.keys(dataset.channels).join(","),
      dataset_id: dataset.id,
      result: items,
      request_meta: { clientSessionId: clientSessionId ?? null },
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Failed to insert generation", insertError);
  }

  return new Response(
    JSON.stringify({ generationId: generationRow?.id, items }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
}

serve(handler);

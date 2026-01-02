import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.5";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

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

  const { generationId, idea, selectedIndex, selectedItem, clientSessionId } = await req.json();

  if (!idea || typeof selectedIndex !== "number" || selectedIndex < 0) {
    return new Response(JSON.stringify({ error: "idea, selectedIndex are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const { error } = await supabase.from("selection_history").insert({
    generation_id: generationId ?? null,
    selected_index: selectedIndex,
    selected_item: selectedItem ?? null,
    idea,
    client_session_id: clientSessionId ?? null,
  });

  if (error) {
    console.error("Failed to insert selection", error);
    return new Response(JSON.stringify({ error: "failed to save selection" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

serve(handler);

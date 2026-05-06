import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { session_id, score, correct_answers, questions_attempted, level, completed } = body;

    if (typeof session_id !== "string") {
      return new Response(JSON.stringify({ error: "session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const update: Record<string, unknown> = {};
    if (typeof score === "number") update.score = Math.max(0, Math.min(10000, score));
    if (typeof correct_answers === "number") update.correct_answers = Math.max(0, Math.min(1000, correct_answers));
    if (typeof questions_attempted === "number") update.questions_attempted = Math.max(0, Math.min(1000, questions_attempted));
    if (typeof level === "string" && level.length <= 50) update.level = level;
    if (completed === true) {
      update.completed = true;
      update.completed_at = new Date().toISOString();
    }

    const { error } = await supabase.from("quiz_sessions").update(update).eq("id", session_id);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
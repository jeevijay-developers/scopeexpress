import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { session_id, answers } = await req.json();
    if (typeof session_id !== "string" || !answers || typeof answers !== "object") {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: session, error: sessErr } = await supabase
      .from("mock_test_sessions")
      .select("id, mock_test_id, completed")
      .eq("id", session_id)
      .maybeSingle();
    if (sessErr || !session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (session.completed) {
      return new Response(JSON.stringify({ error: "Already submitted" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: questions } = await supabase
      .from("mock_test_questions")
      .select("question_number, correct_answer")
      .eq("mock_test_id", session.mock_test_id)
      .order("question_number");

    let correct = 0;
    let totalAttempted = 0;
    const qs = questions || [];
    qs.forEach((q, i) => {
      const ans = answers[i] ?? answers[String(i)];
      if (typeof ans === "number") {
        totalAttempted++;
        if (ans === q.correct_answer) correct++;
      }
    });

    const { error: updErr } = await supabase
      .from("mock_test_sessions")
      .update({
        answers,
        score: correct,
        total_attempted: totalAttempted,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", session_id);

    if (updErr) {
      return new Response(JSON.stringify({ error: updErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, score: correct, total: qs.length, attempted: totalAttempted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
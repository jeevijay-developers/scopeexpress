import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mock_test_id, exam_name, count = 30 } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const prompt = `Generate exactly ${count} multiple choice questions for the "${exam_name}" competitive exam in India. 
These should be based on previous year question papers and common exam patterns.
Mix topics: General Knowledge, Reasoning, Mathematics, English, and subject-specific topics for this exam.

Return ONLY a valid JSON array with exactly ${count} objects. Each object must have:
- "question": the question text (in English)
- "options": array of exactly 4 option strings
- "correct_answer": index of correct option (0-3)

Example format:
[{"question":"What is the capital of India?","options":["Mumbai","Delhi","Kolkata","Chennai"],"correct_answer":1}]

Important: Return ONLY the JSON array, no markdown, no explanation, no code blocks.`;

    console.log(`Generating ${count} questions for ${exam_name}...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert Indian competitive exam question paper creator. Generate accurate previous year style questions. Return ONLY valid JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Clean up response - remove markdown code blocks if present
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    console.log("Parsing AI response...");
    const questions = JSON.parse(content);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid response format from AI");
    }

    // Insert questions into database
    const questionsToInsert = questions.slice(0, count).map((q: any, i: number) => ({
      mock_test_id,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      question_number: i + 1,
    }));

    const { error: insertError } = await supabase
      .from("mock_test_questions")
      .insert(questionsToInsert);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`Failed to insert questions: ${insertError.message}`);
    }

    console.log(`Successfully inserted ${questionsToInsert.length} questions for ${exam_name}`);

    return new Response(
      JSON.stringify({ success: true, count: questionsToInsert.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

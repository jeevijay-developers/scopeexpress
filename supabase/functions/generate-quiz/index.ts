import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // AuthN/AuthZ: require admin user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claimsData, error: claimsErr } = await authClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const adminCheckClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: adminRow } = await adminCheckClient
      .from("admin_users")
      .select("id")
      .eq("user_id", claimsData.claims.sub)
      .maybeSingle();
    if (!adminRow) {
      return new Response(JSON.stringify({ error: "Forbidden - Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { topic, classLevel, language, count } = await req.json();
    const safeCount = Math.max(1, Math.min(50, Number(count) || 10));
    
    console.log(`Generating ${safeCount} questions for topic: ${topic}, class: ${classLevel}, language: ${language}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const topicNames: Record<string, string> = {
      maths: "Mathematics",
      science: "Science",
      gk: "General Knowledge",
      reasoning: "Logical Reasoning",
      history: "History",
    };

    const languageInstruction = language === "hi" 
      ? "Generate all questions and options in Hindi (Devanagari script)." 
      : "Generate all questions and options in English.";

    const systemPrompt = `You are an expert educational content creator for Indian school students. 
Your task is to generate high-quality multiple choice quiz questions.
${languageInstruction}
Questions should be age-appropriate for Class ${classLevel} students (ages ${parseInt(classLevel) + 5}-${parseInt(classLevel) + 6}).
Each question must have exactly 4 options with only one correct answer.
Make questions engaging, educational, and progressively challenging.`;

    const userPrompt = `Generate exactly ${safeCount} multiple choice questions on the topic of ${topicNames[topic] || topic} for Class ${classLevel} students.

Return the questions in this exact JSON format:
{
  "questions": [
    {
      "question": "The question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0
    }
  ]
}

The correct_answer is the index (0-3) of the correct option.
Make sure questions are varied and cover different aspects of ${topicNames[topic] || topic}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI Response content:", content);

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);
    const questions = parsed.questions || [];

    console.log(`Successfully generated ${questions.length} questions`);

    // Save questions to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const questionsToInsert = questions.map((q: any) => ({
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      topic,
      class_level: classLevel,
      language,
    }));

    const { data: insertedData, error: insertError } = await supabase
      .from("quiz_questions")
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting questions:", insertError);
      throw new Error(`Failed to save questions: ${insertError.message}`);
    }

    console.log(`Saved ${insertedData?.length || 0} questions to database`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        questions: insertedData,
        count: insertedData?.length || 0 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-quiz:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

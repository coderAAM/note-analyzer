import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are an intelligent AI Study Assistant designed to help students learn efficiently from their notes.

Analyze the study notes provided and perform the following actions:

1. **Extract Important Points**: List the 5-7 most important concepts, formulas, definitions, and facts. Highlight exam-relevant information.

2. **Create a Simple Summary**: Generate a short, easy-to-understand summary (150-200 words). Explain complex concepts in simple language suitable for beginners.

3. **Generate Questions from the Notes** (STRICTLY based on the given notes only):

   a) **MCQs**: Generate 10 multiple choice questions. Each MCQ should have exactly 4 options. Provide the correct answer index (0-3).
   
   b) **Short Questions**: Generate 5 short-answer questions with brief answers.
   
   c) **Long Questions**: Generate 3 long-answer questions with detailed answers.
   
   d) **Viva Questions**: Generate 5 viva/oral questions for quick revision.

**CRITICAL RULES**:
- Do NOT add information outside the given notes
- Keep the language simple, clear, and exam-oriented
- Be supportive and student-friendly
- All questions and answers must be derived from the provided content

Return your response as a valid JSON object with this exact structure:
{
  "importantPoints": ["point1", "point2", ...],
  "summary": "summary text",
  "mcqs": [
    {
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0
    }
  ],
  "shortQuestions": [
    {
      "question": "question text",
      "answer": "answer text"
    }
  ],
  "longQuestions": [
    {
      "question": "question text",
      "answer": "detailed answer text"
    }
  ],
  "vivaQuestions": [
    {
      "question": "question text",
      "answer": "answer text"
    }
  ]
}`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notes } = await req.json();

    if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
      console.error('Invalid notes provided');
      return new Response(
        JSON.stringify({ error: 'Please provide valid study notes' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing notes with ${notes.length} characters`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here are my study notes to analyze:\n\n${notes}` }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to analyze notes. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received successfully');

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
      console.log('Successfully parsed analysis result');
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the structure
    const requiredFields = ['importantPoints', 'summary', 'mcqs', 'shortQuestions', 'longQuestions', 'vivaQuestions'];
    for (const field of requiredFields) {
      if (!(field in analysisResult)) {
        console.error(`Missing required field: ${field}`);
        return new Response(
          JSON.stringify({ error: `Invalid analysis structure: missing ${field}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-notes function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

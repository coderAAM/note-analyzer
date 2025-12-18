import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const isImageFile = (file: File): boolean => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
  return imageTypes.includes(file.type) || 
    /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(file.name);
};

const extractTextFromImage = async (file: File): Promise<string> => {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  const mimeType = file.type || 'image/jpeg';

  console.log('Sending image to Gemini for OCR...');

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all the text from this image of handwritten or printed notes. Preserve the structure and formatting as much as possible. Only return the extracted text, nothing else. If you cannot read something, indicate it with [illegible]."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`
              }
            }
          ]
        }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OCR API error:", response.status, errorText);
    throw new Error("Failed to extract text from image");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`);

    let extractedText = '';

    // Handle image files with OCR
    if (isImageFile(file)) {
      console.log('Processing image with OCR...');
      extractedText = await extractTextFromImage(file);
      console.log(`Extracted ${extractedText.length} characters from image via OCR`);
    }
    // Handle plain text files
    else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      extractedText = await file.text();
      console.log('Extracted text from TXT file');
    } 
    // Handle PDF files
    else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      let text = '';
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const content = decoder.decode(bytes);
      
      const textMatches = content.match(/\(([^)]+)\)/g);
      if (textMatches) {
        text = textMatches
          .map(match => match.slice(1, -1))
          .filter(t => t.length > 1 && /[a-zA-Z0-9]/.test(t))
          .join(' ');
      }
      
      const readableText = content.match(/[A-Za-z0-9\s.,!?;:'"()-]{10,}/g);
      if (readableText) {
        text += ' ' + readableText.join(' ');
      }
      
      extractedText = text.trim();
      
      if (!extractedText || extractedText.length < 50) {
        return new Response(
          JSON.stringify({ 
            error: 'Could not extract text from PDF. Please copy and paste the text manually, or try a different file format.' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`Extracted ${extractedText.length} characters from PDF`);
    } 
    // Handle DOCX files
    else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const content = decoder.decode(bytes);
      
      const textMatches = content.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (textMatches) {
        extractedText = textMatches
          .map(match => {
            const text = match.replace(/<[^>]+>/g, '');
            return text;
          })
          .join(' ');
      }
      
      if (!extractedText || extractedText.length < 20) {
        return new Response(
          JSON.stringify({ 
            error: 'Could not extract text from DOCX. Please copy and paste the text manually.' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`Extracted ${extractedText.length} characters from DOCX`);
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Please upload TXT, PDF, DOCX, or image files (JPG, PNG, etc.).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up extracted text (skip for OCR since it's already clean)
    if (!isImageFile(file)) {
      extractedText = extractedText
        .replace(/\s+/g, ' ')
        .replace(/[^\x20-\x7E\u0600-\u06FF\u0900-\u097F]/g, ' ')
        .trim();
    }

    if (extractedText.length < 10) {
      return new Response(
        JSON.stringify({ error: 'File appears to be empty or could not extract meaningful text.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        text: extractedText,
        fileName: file.name,
        fileSize: file.size
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing file:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to process file' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

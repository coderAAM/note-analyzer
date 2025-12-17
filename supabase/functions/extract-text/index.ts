import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Handle different file types
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      // Plain text files
      extractedText = await file.text();
      console.log('Extracted text from TXT file');
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // For PDF files, we'll use a simpler approach
      // Extract raw text from PDF (basic extraction)
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Simple PDF text extraction (looks for text streams)
      let text = '';
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const content = decoder.decode(bytes);
      
      // Extract text between BT and ET markers (basic PDF text extraction)
      const textMatches = content.match(/\(([^)]+)\)/g);
      if (textMatches) {
        text = textMatches
          .map(match => match.slice(1, -1))
          .filter(t => t.length > 1 && /[a-zA-Z0-9]/.test(t))
          .join(' ');
      }
      
      // Also try to find readable text sequences
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
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      // For DOCX, extract XML content
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // DOCX is a ZIP file, we'll look for text content
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const content = decoder.decode(bytes);
      
      // Extract text from XML tags
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
        JSON.stringify({ error: 'Unsupported file type. Please upload TXT, PDF, or DOCX files.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\u0600-\u06FF\u0900-\u097F]/g, ' ') // Keep ASCII, Arabic, Hindi
      .trim();

    if (extractedText.length < 20) {
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

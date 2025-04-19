
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioBlob, emergencyKeywords } = await req.json();
    
    if (!audioBlob) {
      throw new Error('No audio data provided');
    }

    // Get audio data and convert from base64
    const base64Data = audioBlob.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a blob from the binary data
    const blob = new Blob([bytes], { type: 'audio/webm' });
    
    // Create form data for OpenAI API
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');
    formData.append('model', 'whisper-1');
    
    // Transcribe audio using OpenAI Whisper API
    const openaiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const transcription = await openaiResponse.json();
    console.log('Transcription:', transcription);
    
    // Detect emergency keywords
    const detectedKeywords = [];
    const transcriptText = transcription.text.toLowerCase();
    
    if (emergencyKeywords && emergencyKeywords.length > 0) {
      for (const keyword of emergencyKeywords) {
        if (transcriptText.includes(keyword.toLowerCase())) {
          detectedKeywords.push(keyword);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        transcription: transcription.text,
        detectedKeywords 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

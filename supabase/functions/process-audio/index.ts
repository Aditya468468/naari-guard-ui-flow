
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

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

    console.log("Received audio data, length:", audioBlob.length);
    console.log("Emergency keywords:", emergencyKeywords);

    // Get audio data and convert from base64
    const base64Data = audioBlob.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log("Converted to binary, size:", bytes.length);

    // Create a blob and buffer
    const blob = new Blob([bytes], { type: 'audio/webm' });
    const buffer = await blob.arrayBuffer();
    
    console.log("Created blob, size:", blob.size);
    
    // Initialize Hugging Face client with the access token
    const hfAccessToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfAccessToken) {
      throw new Error('Hugging Face access token not configured');
    }
    
    const hf = new HfInference(hfAccessToken);
    console.log("Initialized Hugging Face client");
    
    try {
      console.log("Sending to Hugging Face API...");
      
      // Use Hugging Face's automatic speech recognition
      const transcriptionResponse = await hf.automaticSpeechRecognition({
        model: "openai/whisper-small",
        data: buffer,
      });
      
      console.log('Transcription response:', transcriptionResponse);
      
      // Extract the transcribed text
      const transcriptText = transcriptionResponse.text || '';
      console.log('Transcription:', transcriptText);
      
      // Detect emergency keywords
      const detectedKeywords = [];
      const lowerCaseTranscript = transcriptText.toLowerCase();
      
      if (emergencyKeywords && emergencyKeywords.length > 0) {
        for (const keyword of emergencyKeywords) {
          if (lowerCaseTranscript.includes(keyword.toLowerCase())) {
            detectedKeywords.push(keyword);
          }
        }
      }
      
      console.log("Detected keywords:", detectedKeywords);
      
      return new Response(
        JSON.stringify({ 
          transcription: transcriptText,
          detectedKeywords 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } catch (apiError) {
      console.error('Hugging Face API error:', apiError);
      throw new Error(`Hugging Face API error: ${apiError.message}`);
    }
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

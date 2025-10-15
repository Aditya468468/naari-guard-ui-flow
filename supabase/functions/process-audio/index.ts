import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Comprehensive safety keywords
const DEFAULT_SAFETY_KEYWORDS = [
  'help', 'help me', 'save me', 'danger', 'emergency', 'urgent', 'scared', 'afraid',
  'attack', 'assault', 'hurt', 'pain', 'violence', 'abuse', 'harass',
  'stop', 'no', 'leave me alone', 'get away', 'don\'t touch',
  'call police', 'call 911', 'need help', 'sos',
  'bachao', 'madad', 'khatara', 'dar lag raha hai'
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioBlob, emergencyKeywords } = await req.json();
    
    console.log('🎙️ === AUDIO PROCESSING STARTED ===');
    console.log('📝 Keywords to detect:', emergencyKeywords?.length || 0);
    
    if (!audioBlob) {
      throw new Error('No audio data provided');
    }

    // Extract base64 data
    const base64Data = audioBlob.includes(',') ? audioBlob.split(',')[1] : audioBlob;
    
    // Convert to binary
    const binaryString = atob(base64Data);
    const binaryAudio = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryAudio[i] = binaryString.charCodeAt(i);
    }
    
    console.log('✅ Audio decoded, size:', binaryAudio.length, 'bytes');

    // Try OpenAI Whisper first
    let transcriptText = '';
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (openaiApiKey) {
      try {
        console.log('🚀 Attempting OpenAI Whisper transcription...');
        
        const formData = new FormData();
        const audioFile = new Blob([binaryAudio], { type: 'audio/webm' });
        formData.append('file', audioFile, 'audio.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'en');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          transcriptText = data.text || '';
          console.log('✅ OpenAI transcription:', transcriptText);
        } else {
          const errorText = await response.text();
          console.warn('⚠️ OpenAI failed:', errorText);
          
          // If quota exceeded, try Lovable AI as fallback
          if (response.status === 429 || response.status === 402) {
            console.log('💡 Trying Lovable AI as fallback...');
            const lovableKey = Deno.env.get('LOVABLE_API_KEY');
            
            if (lovableKey) {
              const lovableFormData = new FormData();
              lovableFormData.append('file', audioFile, 'audio.webm');
              lovableFormData.append('model', 'whisper-1');
              
              const lovableResponse = await fetch('https://ai.gateway.lovable.dev/v1/audio/transcriptions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${lovableKey}` },
                body: lovableFormData,
              });
              
              if (lovableResponse.ok) {
                const lovableData = await lovableResponse.json();
                transcriptText = lovableData.text || '';
                console.log('✅ Lovable AI transcription:', transcriptText);
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ Transcription error:', error);
      }
    }

    // Combine all keywords
    const allKeywords = [...DEFAULT_SAFETY_KEYWORDS];
    if (emergencyKeywords?.length > 0) {
      allKeywords.push(...emergencyKeywords);
    }

    // KEYWORD DETECTION
    const detectedKeywords: string[] = [];
    const lowerTranscript = transcriptText.toLowerCase();
    
    console.log('==========================================');
    console.log('📝 TRANSCRIPT:', transcriptText);
    console.log('🔍 CHECKING', allKeywords.length, 'KEYWORDS');
    
    for (const keyword of allKeywords) {
      const lowerKeyword = keyword.toLowerCase();
      
      // Check for exact match or word boundary match
      if (lowerTranscript.includes(lowerKeyword)) {
        if (!detectedKeywords.includes(keyword)) {
          detectedKeywords.push(keyword);
          console.log('🚨 DETECTED:', keyword);
        }
      }
    }
    
    const safetyLevel = detectedKeywords.length > 0 ? 'HIGH_ALERT' : 'NORMAL';
    
    console.log('==========================================');
    console.log('✅ DETECTED KEYWORDS:', detectedKeywords);
    console.log('🚦 SAFETY LEVEL:', safetyLevel);
    console.log('==========================================');
    
    return new Response(
      JSON.stringify({ 
        transcription: transcriptText,
        detectedKeywords,
        totalKeywordsChecked: allKeywords.length,
        safetyLevel
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        detectedKeywords: [],
        transcription: '',
        safetyLevel: 'ERROR'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

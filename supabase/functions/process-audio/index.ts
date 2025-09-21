
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Comprehensive safety keywords for women's safety
const DEFAULT_SAFETY_KEYWORDS = [
  // Emergency distress words
  'help', 'help me', 'save me', 'danger', 'emergency', 'urgent', 'scared', 'afraid', 'terrified',
  'panic', 'trapped', 'stuck', 'lost', 'alone', 'vulnerable', 'unsafe', 'threatened', 'intimidated',
  
  // Physical threats and violence
  'attack', 'attacking', 'attacker', 'assault', 'assaulting', 'hit', 'hitting', 'beat', 'beating',
  'punch', 'punching', 'kick', 'kicking', 'grab', 'grabbing', 'push', 'pushing', 'shove', 'shoving',
  'hurt', 'hurting', 'pain', 'bleeding', 'injured', 'wound', 'bruise', 'violence', 'violent',
  'abuse', 'abusing', 'harass', 'harassment', 'molest', 'molestation', 'rape', 'sexual assault',
  'domestic violence', 'stalking', 'stalker', 'following', 'watching me',
  
  // Death threats and life-threatening situations
  'die', 'dying', 'death', 'kill', 'killing', 'murder', 'dead', 'suffocate', 'choke', 'choking',
  'strangle', 'strangling', 'poison', 'poisoning', 'overdose', 'suicide', 'suicidal',
  
  // Kidnapping and abduction
  'kidnap', 'kidnapping', 'abduct', 'abduction', 'taken', 'forced', 'drag', 'dragging',
  'car', 'van', 'trunk', 'basement', 'locked', 'tied', 'bound', 'captive', 'prisoner',
  
  // Weapon-related
  'gun', 'knife', 'weapon', 'armed', 'shoot', 'shooting', 'shot', 'stab', 'stabbing',
  'blade', 'pistol', 'rifle', 'firearm', 'bomb', 'explosive',
  
  // Medical emergencies
  'medical emergency', 'heart attack', 'stroke', 'seizure', 'unconscious', 'faint', 'fainting',
  'overdose', 'allergic reaction', 'can\'t breathe', 'breathing problems', 'chest pain',
  
  // Location-based safety concerns
  'dark alley', 'abandoned', 'deserted', 'isolated', 'empty street', 'parking garage',
  'following me home', 'stranger danger', 'suspicious person', 'creepy guy',
  
  // Emotional distress indicators
  'crying', 'sobbing', 'screaming', 'yelling', 'shouting', 'please stop', 'leave me alone',
  'get away', 'don\'t touch me', 'no means no', 'stop it', 'quit it',
  
  // Communication keywords
  'call police', 'call 911', 'call emergency', 'need ambulance', 'need help now',
  'send help', 'contact family', 'notify emergency contact', 'trace my location'
]

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
    console.log("Emergency keywords provided:", emergencyKeywords);

    // Get audio data and convert from base64
    const base64Data = audioBlob.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid audio data format');
    }

    // Process base64 in chunks to prevent memory issues with large audio files
    function processBase64Chunks(base64String: string, chunkSize = 32768) {
      const chunks: Uint8Array[] = [];
      let position = 0;
      
      while (position < base64String.length) {
        const chunk = base64String.slice(position, position + chunkSize);
        const binaryChunk = atob(chunk);
        const bytes = new Uint8Array(binaryChunk.length);
        
        for (let i = 0; i < binaryChunk.length; i++) {
          bytes[i] = binaryChunk.charCodeAt(i);
        }
        
        chunks.push(bytes);
        position += chunkSize;
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result;
    }

    const binaryAudio = processBase64Chunks(base64Data);
    console.log("Converted to binary, size:", binaryAudio.length);
    
    if (binaryAudio.length === 0) {
      throw new Error('Empty audio data after conversion');
    }

    // Use OpenAI Whisper for more accurate transcription
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log("Using OpenAI Whisper for transcription...");
    
    // Prepare form data for OpenAI Whisper API
    const formData = new FormData();
    const audioFile = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', audioFile, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Focus on English for better safety keyword detection

    // Send to OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const transcriptionData = await response.json();
    const transcriptText = transcriptionData.text || '';
    console.log('OpenAI Whisper transcription:', transcriptText);

    // Combine provided keywords with default safety keywords
    const allKeywords = [...DEFAULT_SAFETY_KEYWORDS];
    if (emergencyKeywords && emergencyKeywords.length > 0) {
      allKeywords.push(...emergencyKeywords);
    }

    // Enhanced keyword detection algorithm
    const detectedKeywords: string[] = [];
    const lowerCaseTranscript = transcriptText.toLowerCase();
    
    console.log("Checking for keywords in:", lowerCaseTranscript);
    
    for (const keyword of allKeywords) {
      const keywordLower = keyword.toLowerCase();
      
      // Check for exact matches and partial word matches
      if (lowerCaseTranscript.includes(keywordLower)) {
        // Avoid duplicates
        if (!detectedKeywords.includes(keyword)) {
          detectedKeywords.push(keyword);
          console.log(`⚠️ SAFETY KEYWORD DETECTED: ${keyword}`);
        }
      }
    }
    
    // Additional pattern matching for urgency indicators
    const urgencyPatterns = [
      /help\s*me/gi,
      /save\s*me/gi,
      /get\s*away/gi,
      /leave\s*me\s*alone/gi,
      /stop\s*it/gi,
      /call\s*(911|police|emergency)/gi,
      /someone\s*help/gi,
      /i'm\s*(scared|afraid|in\s*danger)/gi,
    ];

    for (const pattern of urgencyPatterns) {
      const matches = transcriptText.match(pattern);
      if (matches) {
        for (const match of matches) {
          if (!detectedKeywords.includes(match.toLowerCase())) {
            detectedKeywords.push(match.toLowerCase());
            console.log(`⚠️ URGENCY PATTERN DETECTED: ${match}`);
          }
        }
      }
    }
    
    console.log("Final detected keywords:", detectedKeywords);
    
    return new Response(
      JSON.stringify({ 
        transcription: transcriptText,
        detectedKeywords,
        totalKeywordsChecked: allKeywords.length,
        safetyLevel: detectedKeywords.length > 0 ? 'HIGH_ALERT' : 'NORMAL'
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

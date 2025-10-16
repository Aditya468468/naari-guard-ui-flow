import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    console.log('Received message:', message);

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `You are an advanced AI safety companion for women's safety app called NaariGuard AI. 
            Your role is to:
            1. Provide emotional support and comfort with empathy
            2. Offer practical safety advice and tips
            3. Help users feel calm during stressful situations
            4. Detect emergency keywords and activate emergency mode
            5. Guide them through emergency procedures if needed
            6. Be empathetic, understanding, and reassuring
            
            EMERGENCY MODE ACTIVATION:
            If the user says phrases like "activate emergency mode", "emergency", "help me", "I'm in danger", "activate SOS", or similar distress signals:
            - Respond with: "🚨 EMERGENCY MODE ACTIVATED! Your trust circle is being alerted and your location is being shared. Stay calm, help is on the way. If you can, try to move to a safe location. Police emergency: 100 | Women Helpline: 1091"
            - Be very supportive and calm
            
            Keep responses concise, warm, and actionable. Use emojis where appropriate to make responses friendly. If the user seems in distress, prioritize their safety.` 
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    console.log('AI response:', data);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded",
            response: "I'm experiencing high traffic right now. Please try again in a moment."
          }), 
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Payment required",
            response: "AI service requires credits. Please contact support."
          }), 
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      throw new Error(data.error?.message || 'AI API error');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I'm having trouble connecting right now. Please try again in a moment, or contact emergency services if you need immediate help."
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

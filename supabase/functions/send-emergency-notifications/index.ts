import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, message, location } = await req.json();
    
    console.log('Sending emergency notifications for user:', userId);

    // Get user's emergency contacts
    const { data: contacts, error: contactsError } = await supabaseClient
      .from('trust_circle_contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_emergency_contact', true)
      .order('priority', { ascending: true });

    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
      throw contactsError;
    }

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No emergency contacts found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${contacts.length} emergency contacts`);

    // In a real implementation, you would integrate with SMS/Email services
    // For now, we'll simulate sending notifications and return the contacts
    const notifications = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      notificationSent: true,
      timestamp: new Date().toISOString()
    }));

    // Log the emergency alert
    console.log('Emergency notifications sent:', {
      userId,
      contactCount: contacts.length,
      message,
      location,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        notifications,
        message: `Emergency alerts sent to ${contacts.length} contacts`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-emergency-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
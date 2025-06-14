
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const handler = async (req: Request): Promise<Response> => {
  try {
    console.log('Setting up Resend API key...');
    
    // This is just a setup function - the API key should be set via Supabase dashboard
    // or environment variables
    const apiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'RESEND_API_KEY not found in environment variables',
          message: 'Please add the API key as a secret in Supabase dashboard'
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Resend API key is configured',
        keyLength: apiKey.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in setup-resend-key function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack || 'No stack trace available'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);

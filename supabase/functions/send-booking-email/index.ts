
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Edge function called - send-booking-email");
  console.log("Request method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    console.log("RESEND_API_KEY is available:", !!resendApiKey);
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const body = await req.json();
    console.log("Request body received:", body);

    const { to, subject, studentName, productName, quantity, totalPrice, status, bookingId } = body;
    
    console.log("Sending booking email to:", to);
    console.log("Email subject:", subject);

    const resend = new Resend(resendApiKey);

    console.log("Preparing to send email via Resend...");

    const emailData = {
      from: "Academy <onboarding@resend.dev>",
      to: [to],
      subject: subject || `Booking ${status} - ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e40af;">Booking ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
          
          <p>Dear ${studentName},</p>
          
          <p>Your booking has been <strong>${status}</strong>.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details:</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Total Price:</strong> ${totalPrice}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Status:</strong> ${status}</p>
          </div>
          
          ${status === 'confirmed' ? `
            <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
              <p style="margin: 0;"><strong>✅ Your booking is confirmed!</strong></p>
              <p style="margin: 10px 0 0 0;">Please bring your booking ID when picking up your order.</p>
            </div>
          ` : ''}
          
          <p style="margin-top: 30px;">
            Thank you for using our platform! ${studentName}
          </p>
          
          <p>Best regards,<br>
          The Mpesa Foundation Academy Vision Ventures</p>
        </div>
      `,
    };

    console.log("Sending email with data:", emailData);

    const result = await resend.emails.send(emailData);
    
    console.log("Email sent successfully via Resend:", result);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack || 'No stack trace available'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  to: string;
  subject: string;
  studentName: string;
  productName: string;
  quantity: number;
  totalPrice: string;
  status: string;
  pickupCode?: string;
  bookingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      to, 
      subject, 
      studentName, 
      productName, 
      quantity, 
      totalPrice, 
      status, 
      pickupCode,
      bookingId 
    }: BookingEmailRequest = await req.json();

    console.log('Sending booking email to:', to);

    const getEmailContent = () => {
      switch (status) {
        case 'pending':
          return `
            <h1>Booking Confirmation</h1>
            <p>Dear ${studentName},</p>
            <p>Your booking has been successfully created and is pending confirmation.</p>
            <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Booking Details:</h3>
              <p><strong>Product:</strong> ${productName}</p>
              <p><strong>Quantity:</strong> ${quantity}</p>
              <p><strong>Total Price:</strong> ${totalPrice}</p>
              <p><strong>Status:</strong> Pending Confirmation</p>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
            </div>
            <p>You will receive another email once your booking is confirmed by the enterprise.</p>
            <p>Thank you for your booking!</p>
            <p>Best regards,<br>Academy Marketplace Team</p>
          `;
        
        case 'confirmed':
          return `
            <h1>Booking Confirmed! 🎉</h1>
            <p>Dear ${studentName},</p>
            <p>Great news! Your booking has been confirmed.</p>
            <div style="background-color: #e8f5e8; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #4caf50;">
              <h3>Booking Details:</h3>
              <p><strong>Product:</strong> ${productName}</p>
              <p><strong>Quantity:</strong> ${quantity}</p>
              <p><strong>Total Price:</strong> ${totalPrice}</p>
              <p><strong>Status:</strong> Confirmed</p>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
              ${pickupCode ? `<p><strong>Pickup Code:</strong> <span style="background-color: #fff; padding: 5px 10px; border: 2px solid #4caf50; border-radius: 3px; font-weight: bold; color: #4caf50;">${pickupCode}</span></p>` : ''}
            </div>
            ${pickupCode ? '<p><strong>Important:</strong> Please bring your pickup code when collecting your order. The code is valid for 24 hours.</p>' : ''}
            <p>You can now proceed to pick up your order from the enterprise.</p>
            <p>Thank you for your business!</p>
            <p>Best regards,<br>Academy Marketplace Team</p>
          `;
        
        case 'cancelled':
          return `
            <h1>Booking Cancelled</h1>
            <p>Dear ${studentName},</p>
            <p>We regret to inform you that your booking has been cancelled.</p>
            <div style="background-color: #fff2f2; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #f44336;">
              <h3>Cancelled Booking Details:</h3>
              <p><strong>Product:</strong> ${productName}</p>
              <p><strong>Quantity:</strong> ${quantity}</p>
              <p><strong>Total Price:</strong> ${totalPrice}</p>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
            </div>
            <p>If you have any questions about this cancellation, please contact the enterprise directly or our support team.</p>
            <p>We apologize for any inconvenience caused.</p>
            <p>Best regards,<br>Academy Marketplace Team</p>
          `;
        
        default:
          return `
            <h1>Booking Update</h1>
            <p>Dear ${studentName},</p>
            <p>Your booking status has been updated.</p>
            <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Booking Details:</h3>
              <p><strong>Product:</strong> ${productName}</p>
              <p><strong>Quantity:</strong> ${quantity}</p>
              <p><strong>Total Price:</strong> ${totalPrice}</p>
              <p><strong>Status:</strong> ${status}</p>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
            </div>
            <p>Thank you for using Academy Marketplace!</p>
            <p>Best regards,<br>Academy Marketplace Team</p>
          `;
      }
    };

    const emailResponse = await resend.emails.send({
      from: "Academy Marketplace <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: getEmailContent(),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

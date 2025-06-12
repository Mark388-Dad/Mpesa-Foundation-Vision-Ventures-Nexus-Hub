
import { supabase } from "@/integrations/supabase/client";

interface SendBookingEmailParams {
  userEmail: string;
  studentName: string;
  productName: string;
  quantity: number;
  totalPrice: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  pickupCode?: string;
  bookingId: string;
}

export const sendBookingEmail = async (params: SendBookingEmailParams) => {
  try {
    const subject = getEmailSubject(params.status, params.productName);
    
    console.log('Sending booking email with params:', params);
    
    const { data, error } = await supabase.functions.invoke('send-booking-email', {
      body: {
        to: params.userEmail,
        subject,
        studentName: params.studentName,
        productName: params.productName,
        quantity: params.quantity,
        totalPrice: params.totalPrice,
        status: params.status,
        pickupCode: params.pickupCode,
        bookingId: params.bookingId,
      },
    });

    if (error) {
      console.error('Error sending booking email:', error);
      throw error;
    }

    console.log('Booking email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send booking email:', error);
    throw error;
  }
};

const getEmailSubject = (status: string, productName: string): string => {
  switch (status) {
    case 'pending':
      return `Booking Created - ${productName}`;
    case 'confirmed':
      return `Booking Confirmed - ${productName}`;
    case 'cancelled':
      return `Booking Cancelled - ${productName}`;
    case 'completed':
      return `Order Completed - ${productName}`;
    default:
      return `Booking Update - ${productName}`;
  }
};

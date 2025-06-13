import emailjs from '@emailjs/browser';

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
    
    console.log('Sending booking email with EmailJS and params:', params);
    console.log('Email subject:', subject);
    
    // Initialize EmailJS with your public key
    emailjs.init("bRQHjMXExw_vnX2WU");
    
    const templateParams = {
      to_email: params.userEmail,
      to_name: params.studentName,
      subject: subject,
      student_name: params.studentName,
      product_name: params.productName,
      quantity: params.quantity.toString(),
      total_price: params.totalPrice,
      status: params.status,
      pickup_code: params.pickupCode || '',
      booking_id: params.bookingId,
      message: getEmailContent(params.status, params.studentName, params.productName, params.quantity, params.totalPrice, params.bookingId, params.pickupCode)
    };

    console.log('Sending email with template params:', templateParams);

    const response = await emailjs.send(
      'service_2a6q3e5', // Your service ID
      'template123',     // Your template ID
      templateParams
    );

    console.log('Email sent successfully via EmailJS:', response);
    return response;
  } catch (error) {
    console.error('Failed to send booking email:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
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

const getEmailContent = (
  status: string, 
  studentName: string, 
  productName: string, 
  quantity: number, 
  totalPrice: string, 
  bookingId: string, 
  pickupCode?: string
): string => {
  switch (status) {
    case 'pending':
      return `Dear ${studentName},

Your booking has been successfully created and is pending confirmation.

Booking Details:
- Product: ${productName}
- Quantity: ${quantity}
- Total Price: ${totalPrice}
- Status: Pending Confirmation
- Booking ID: ${bookingId}

You will receive another email once your booking is confirmed by the enterprise.

Thank you for your booking!

Best regards,
Academy Marketplace Team`;
    
    case 'confirmed':
      return `Dear ${studentName},

Great news! Your booking has been confirmed.

Booking Details:
- Product: ${productName}
- Quantity: ${quantity}
- Total Price: ${totalPrice}
- Status: Confirmed
- Booking ID: ${bookingId}
${pickupCode ? `- Pickup Code: ${pickupCode}` : ''}

${pickupCode ? 'Important: Please bring your pickup code when collecting your order. The code is valid for 24 hours.' : ''}

You can now proceed to pick up your order from the enterprise.

Thank you for your business!

Best regards,
Academy Marketplace Team`;
    
    case 'cancelled':
      return `Dear ${studentName},

We regret to inform you that your booking has been cancelled.

Cancelled Booking Details:
- Product: ${productName}
- Quantity: ${quantity}
- Total Price: ${totalPrice}
- Booking ID: ${bookingId}

If you have any questions about this cancellation, please contact the enterprise directly or our support team.

We apologize for any inconvenience caused.

Best regards,
Academy Marketplace Team`;
    
    default:
      return `Dear ${studentName},

Your booking status has been updated.

Booking Details:
- Product: ${productName}
- Quantity: ${quantity}
- Total Price: ${totalPrice}
- Status: ${status}
- Booking ID: ${bookingId}

Thank you for using Academy Marketplace!

Best regards,
Academy Marketplace Team`;
  }
};

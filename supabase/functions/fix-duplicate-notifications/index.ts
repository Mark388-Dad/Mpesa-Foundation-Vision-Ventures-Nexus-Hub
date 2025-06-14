
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fixing duplicate notifications function');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Drop the existing trigger first
    const { error: dropTriggerError } = await supabaseClient.rpc('exec_sql', {
      sql: 'DROP TRIGGER IF EXISTS booking_notifications_trigger ON bookings;'
    });

    if (dropTriggerError) {
      console.error('Error dropping trigger:', dropTriggerError);
    }

    // Update the function to prevent duplicates
    const { error: functionError } = await supabaseClient.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.send_booking_notifications()
        RETURNS trigger
        LANGUAGE plpgsql
        AS $function$
        DECLARE
          product_name TEXT;
          enterprise_id UUID;
          enterprise_owner_id UUID;
          staff_ids UUID[];
          staff_id UUID;
          order_code TEXT;
          notification_exists BOOLEAN;
        BEGIN
          -- Get product name and enterprise info
          SELECT p.name, p.enterprise_id INTO product_name, enterprise_id
          FROM products p WHERE p.id = NEW.product_id;
          
          -- Get enterprise owner
          SELECT owner_id INTO enterprise_owner_id
          FROM enterprises WHERE id = enterprise_id;
          
          -- Get staff members
          SELECT array_agg(id) INTO staff_ids
          FROM profiles WHERE role = 'staff';
          
          -- Generate order code for confirmed bookings
          IF NEW.status = 'confirmed' AND (TG_OP = 'INSERT' OR OLD.status != 'confirmed') THEN
            order_code := 'ORD-' || UPPER(substring(gen_random_uuid()::text from 1 for 8));
            
            -- Insert order code if it doesn't exist
            INSERT INTO order_codes (booking_id, code, expires_at)
            VALUES (NEW.id, order_code, now() + INTERVAL '24 hours')
            ON CONFLICT (booking_id) DO NOTHING;
            
            -- Update booking with pickup code
            UPDATE bookings SET pickup_code = order_code WHERE id = NEW.id;
          END IF;
          
          -- Only send notifications on status change (not on updates like pickup_code)
          IF TG_OP = 'INSERT' OR (OLD.status IS NOT NULL AND OLD.status != NEW.status) THEN
            -- Check if notification already exists to prevent duplicates
            SELECT EXISTS(
              SELECT 1 FROM notifications 
              WHERE user_id = NEW.student_id 
              AND related_id = NEW.id 
              AND type = 'booking'
              AND title = 'Booking ' || NEW.status
            ) INTO notification_exists;
            
            -- Notification to student (only if doesn't exist)
            IF NOT notification_exists THEN
              INSERT INTO notifications (user_id, type, title, message, related_id)
              VALUES (
                NEW.student_id,
                'booking',
                'Booking ' || NEW.status,
                CASE 
                  WHEN NEW.status = 'confirmed' THEN 
                    'Your booking for "' || COALESCE(product_name, 'Unknown Product') || '" has been confirmed at ' || 
                    to_char(now(), 'YYYY-MM-DD HH24:MI:SS') || '. Your pickup code is: ' || COALESCE(order_code, NEW.pickup_code, 'N/A')
                  ELSE 
                    'Your booking for "' || COALESCE(product_name, 'Unknown Product') || '" has been ' || NEW.status || ' at ' ||
                    to_char(now(), 'YYYY-MM-DD HH24:MI:SS') || '.'
                END,
                NEW.id
              );
            END IF;
            
            -- Notification to enterprise owner (check for duplicates)
            IF enterprise_owner_id IS NOT NULL THEN
              SELECT EXISTS(
                SELECT 1 FROM notifications 
                WHERE user_id = enterprise_owner_id 
                AND related_id = NEW.id 
                AND type = 'booking'
                AND title = 'New booking ' || NEW.status
              ) INTO notification_exists;
              
              IF NOT notification_exists THEN
                INSERT INTO notifications (user_id, type, title, message, related_id)
                VALUES (
                  enterprise_owner_id,
                  'booking',
                  'New booking ' || NEW.status,
                  CASE 
                    WHEN NEW.status = 'confirmed' THEN 
                      'A booking for your product "' || COALESCE(product_name, 'Unknown Product') || '" has been confirmed at ' || 
                      to_char(now(), 'YYYY-MM-DD HH24:MI:SS') || '. Order code: ' || COALESCE(order_code, NEW.pickup_code, 'N/A')
                    ELSE 
                      'A booking for your product "' || COALESCE(product_name, 'Unknown Product') || '" has been ' || NEW.status || ' at ' ||
                      to_char(now(), 'YYYY-MM-DD HH24:MI:SS') || '.'
                  END,
                  NEW.id
                );
              END IF;
            END IF;
            
            -- Notifications to staff members (check for duplicates)
            IF staff_ids IS NOT NULL THEN
              FOREACH staff_id IN ARRAY staff_ids
              LOOP
                SELECT EXISTS(
                  SELECT 1 FROM notifications 
                  WHERE user_id = staff_id 
                  AND related_id = NEW.id 
                  AND type = 'booking'
                  AND title = 'Booking ' || NEW.status
                ) INTO notification_exists;
                
                IF NOT notification_exists THEN
                  INSERT INTO notifications (user_id, type, title, message, related_id)
                  VALUES (
                    staff_id,
                    'booking',
                    'Booking ' || NEW.status,
                    CASE 
                      WHEN NEW.status = 'confirmed' THEN 
                        'A booking for "' || COALESCE(product_name, 'Unknown Product') || '" has been confirmed at ' || 
                        to_char(now(), 'YYYY-MM-DD HH24:MI:SS') || '. Order code: ' || COALESCE(order_code, NEW.pickup_code, 'N/A')
                      ELSE 
                        'A booking for "' || COALESCE(product_name, 'Unknown Product') || '" has been ' || NEW.status || ' at ' ||
                        to_char(now(), 'YYYY-MM-DD HH24:MI:SS') || '.'
                    END,
                    NEW.id
                  );
                END IF;
              END LOOP;
            END IF;
          END IF;
          
          RETURN NEW;
        END;
        $function$
      `
    });

    if (functionError) {
      console.error('Error updating function:', functionError);
      throw functionError;
    }

    // Recreate the trigger
    const { error: triggerError } = await supabaseClient.rpc('exec_sql', {
      sql: `
        CREATE TRIGGER booking_notifications_trigger
        AFTER INSERT OR UPDATE ON bookings
        FOR EACH ROW
        EXECUTE FUNCTION send_booking_notifications();
      `
    });

    if (triggerError) {
      console.error('Error creating trigger:', triggerError);
      throw triggerError;
    }

    console.log('Successfully updated notification system to prevent duplicates');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Notification system updated to prevent duplicates and include timestamps' 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in fix-duplicate-notifications function:", error);
    
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

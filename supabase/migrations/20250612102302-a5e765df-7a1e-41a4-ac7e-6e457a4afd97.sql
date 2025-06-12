
-- Drop the existing insert policy and create a more permissive one
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a policy that allows authenticated users to insert notifications
-- This will allow the BookingForm to create notifications for any user
CREATE POLICY "Authenticated users can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

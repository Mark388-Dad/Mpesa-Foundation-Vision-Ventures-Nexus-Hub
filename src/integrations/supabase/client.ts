// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://avycfonbnecfhrgmkqjv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eWNmb25ibmVjZmhyZ21rcWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzA3OTcsImV4cCI6MjA2MTg0Njc5N30.0xjOGSqgMQ1TQaZaahpLa8iJkDY9itHR2x11SKeb598";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
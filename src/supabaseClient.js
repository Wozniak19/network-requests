import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yicrrkqhsbnlbltjyabh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpY3Jya3Foc2JubGJsdGp5YWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI4NzMsImV4cCI6MjA2MjI4ODg3M30.j_91ZU_U0WExPqP0o-d-8x35rzS-vRkVyglO6waNxFk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

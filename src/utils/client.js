import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.SUPABASE_URL ?? "",
//   process.env.SUPABASE_ANON_KEY ?? ""
// );

const supabase = createClient(
  "https://zwgovmkukyfqznkspkdm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3Z292bWt1a3lmcXpua3Nwa2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NjYwNDksImV4cCI6MjA3MTM0MjA0OX0.IWRHpRluEDB2TwkP2ovZrD7HV_CEaQLZIVYSRQgEb4w"
);

export default supabase;

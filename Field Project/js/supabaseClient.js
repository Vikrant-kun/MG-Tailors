import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://usjsiofkcmogxqoqbvfh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzanNpb2ZrY21vZ3hxb3FidmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MTY1NTUsImV4cCI6MjA3NDE5MjU1NX0.gvynAkhQanRlag9yp4lJ3-zQu5v8Menw9Z_inpUpLrE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
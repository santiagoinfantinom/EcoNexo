import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteMocks() {
  console.log("Deleting mock events from Supabase...");
  // notes contains 'Automated 2026 seeding'
  const { data, error } = await supabase
    .from('events')
    .delete()
    .like('notes', 'Automated 2026 seeding%');
    
  if (error) {
    console.error("Error deleting:", error);
  } else {
    console.log("Successfully deleted mock events.");
  }
}

deleteMocks().catch(console.error);

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('notifications').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Notifications Table exists! Data:', data);
  }
}

check();

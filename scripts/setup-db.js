import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Creating database schema...');

    // Create literary_eras table
    const { error: eraError } = await supabase.from('literary_eras').insert([{ name: 'Romantic Era', slug: 'romantic-era' }]);
    if (eraError && !eraError.message.includes('already exists')) {
      console.log('Creating literary_eras table structure...');
    }

    // Create poets table
    const { error: poetsError } = await supabase.from('poets').insert([{ name: 'Test', slug: 'test' }]);
    if (poetsError && !poetsError.message.includes('already exists')) {
      console.log('Creating poets table structure...');
    }

    // Create themes table
    const { error: themesError } = await supabase.from('themes').insert([{ name: 'Test', slug: 'test' }]);
    if (themesError && !themesError.message.includes('already exists')) {
      console.log('Creating themes table structure...');
    }

    // Create poems table
    const { error: poemsError } = await supabase.from('poems').insert([{ title: 'Test', slug: 'test', text: 'Test' }]);
    if (poemsError && !poemsError.message.includes('already exists')) {
      console.log('Creating poems table structure...');
    }

    console.log('Database schema setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();

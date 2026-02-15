import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  try {
    console.log('[v0] Starting database seed...');

    // Insert Literary Eras
    const eraData = [
      { name: 'Romantic Era', slug: 'romantic-era', description: 'The Romantic movement emphasized emotion, nature, and individualism', start_year: 1800, end_year: 1850 },
      { name: 'Victorian Era', slug: 'victorian-era', description: 'The Victorian era was marked by optimism and social progress', start_year: 1837, end_year: 1901 },
      { name: 'Modernist Era', slug: 'modernist-era', description: 'Modernism broke with traditional forms and experimented with new styles', start_year: 1890, end_year: 1945 },
    ];

    const { data: eras, error: eraError } = await supabase
      .from('literary_eras')
      .insert(eraData)
      .select();

    if (eraError) {
      console.error('[v0] Error inserting eras:', eraError);
    } else {
      console.log('[v0] Inserted eras:', eras?.length);
    }

    // Insert Poets
    const poetData = [
      {
        name: 'William Wordsworth',
        slug: 'william-wordsworth',
        birth_year: 1770,
        death_year: 1850,
        era_id: eras?.[0]?.id,
        bio: 'William Wordsworth was a major English Romantic poet who helped launch the Romantic Age in English literature with the 1798 publication of Lyrical Ballads.',
        nationality: 'British',
      },
      {
        name: 'Emily Dickinson',
        slug: 'emily-dickinson',
        birth_year: 1830,
        death_year: 1886,
        era_id: eras?.[1]?.id,
        bio: 'Emily Dickinson was an American poet who lived a largely reclusive life and wrote about themes of death, immortality, and love.',
        nationality: 'American',
      },
      {
        name: 'Edgar Allan Poe',
        slug: 'edgar-allan-poe',
        birth_year: 1809,
        death_year: 1849,
        era_id: eras?.[1]?.id,
        bio: 'Edgar Poe was an American writer, poet, editor, and literary critic, considered part of the American Romantic movement. His detective fiction is regarded as a precursor of the modern detective story.',
        nationality: 'American',
      },
    ];

    const { data: poets, error: poetError } = await supabase
      .from('poets')
      .insert(poetData)
      .select();

    if (poetError) {
      console.error('[v0] Error inserting poets:', poetError);
    } else {
      console.log('[v0] Inserted poets:', poets?.length);
    }

    // Insert Themes
    const themeData = [
      { name: 'Love', slug: 'love', description: 'Poems exploring themes of love and romance' },
      { name: 'Nature', slug: 'nature', description: 'Poems celebrating the natural world' },
      { name: 'Death', slug: 'death', description: 'Poems contemplating mortality and loss' },
      { name: 'Solitude', slug: 'solitude', description: 'Poems about loneliness and isolation' },
      { name: 'Hope', slug: 'hope', description: 'Poems expressing optimism and aspiration' },
    ];

    const { data: themes, error: themeError } = await supabase
      .from('themes')
      .insert(themeData)
      .select();

    if (themeError) {
      console.error('[v0] Error inserting themes:', themeError);
    } else {
      console.log('[v0] Inserted themes:', themes?.length);
    }

    // Insert Poems
    const poemData = [
      {
        title: 'Hope is the thing with feathers',
        slug: 'hope-is-the-thing-with-feathers',
        poet_id: poets?.find(p => p.slug === 'emily-dickinson')?.id,
        text: '"Hope" is the thing with feathers -\nThat perches in the soul -\nAnd sings the tune without the words -\nAnd never stops - at all -',
        summary: 'A short, powerful poem about hope as an enduring force within the human spirit.',
        intro: 'Emily Dickinson\'s "Hope is the thing with feathers" is one of her most famous poems, using bird imagery to represent hope.',
        meta_title: 'Hope is the thing with feathers - Emily Dickinson',
        meta_description: 'Read the full text of Emily Dickinson\'s "Hope is the thing with feathers" with analysis and meaning.',
        word_count: 25,
        line_count: 4,
        is_classic: true,
        is_published: true,
      },
      {
        title: 'The Raven',
        slug: 'the-raven',
        poet_id: poets?.find(p => p.slug === 'edgar-allan-poe')?.id,
        text: 'Once upon a midnight dreary, as I pondered, weak and weary,\nOver many a quaint and curious volume of forgotten lore—\nWhile I nodded, napping suddenly, there came a tapping, gently rapping,\n"Sir or Madam," came a rapping, "at your chamber door.',
        summary: 'The Raven is a narrative poem about a grieving man visited by a mysterious raven that only speaks one word: "Nevermore."',
        intro: 'Published in 1845, "The Raven" by Edgar Allan Poe is one of the most famous American poems, known for its musical rhythm and dark atmosphere.',
        meta_title: 'The Raven - Edgar Allan Poe | Full Poem & Analysis',
        meta_description: 'Read the complete text of "The Raven" by Edgar Allan Poe with summary, themes, and literary analysis.',
        word_count: 1000,
        line_count: 108,
        is_classic: true,
        is_published: true,
      },
      {
        title: 'I Wandered Lonely as a Cloud',
        slug: 'i-wandered-lonely-as-a-cloud',
        poet_id: poets?.find(p => p.slug === 'william-wordsworth')?.id,
        text: 'I wandered lonely as a cloud\nThat floats on high o\'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;',
        summary: 'Wordsworth\'s famous poem about encountering a field of daffodils and the emotional impact of nature\'s beauty.',
        intro: 'Also known as "Daffodils," this poem describes the poet\'s encounter with a field of golden daffodils and reflects on the lasting joy this memory brings.',
        meta_title: 'I Wandered Lonely as a Cloud - William Wordsworth',
        meta_description: 'Read the full text of Wordsworth\'s "I Wandered Lonely as a Cloud" (Daffodils) with analysis and meaning.',
        word_count: 160,
        line_count: 16,
        is_classic: true,
        is_published: true,
      },
    ];

    const { data: poems, error: poemError } = await supabase
      .from('poems')
      .insert(poemData)
      .select();

    if (poemError) {
      console.error('[v0] Error inserting poems:', poemError);
    } else {
      console.log('[v0] Inserted poems:', poems?.length);
    }

    // Link poems to themes
    const poemThemeData = [
      {
        poem_id: poems?.find(p => p.slug === 'hope-is-the-thing-with-feathers')?.id,
        theme_id: themes?.find(t => t.slug === 'hope')?.id,
      },
      {
        poem_id: poems?.find(p => p.slug === 'the-raven')?.id,
        theme_id: themes?.find(t => t.slug === 'death')?.id,
      },
      {
        poem_id: poems?.find(p => p.slug === 'i-wandered-lonely-as-a-cloud')?.id,
        theme_id: themes?.find(t => t.slug === 'nature')?.id,
      },
    ];

    const { error: poemThemeError } = await supabase
      .from('poem_themes')
      .insert(poemThemeData);

    if (poemThemeError) {
      console.error('[v0] Error linking poem themes:', poemThemeError);
    } else {
      console.log('[v0] Linked poems to themes');
    }

    console.log('[v0] Database seed complete!');
  } catch (error) {
    console.error('[v0] Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();

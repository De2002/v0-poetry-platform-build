import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const poets = [
  {
    name: 'Emily Dickinson',
    slug: 'emily-dickinson',
    bio: 'Emily Dickinson was an American poet known for short, powerful poems about death, faith, and nature. Working largely in isolation, she developed a distinctive style using dashes, slant rhyme, and innovative capitalization. Her work revolutionized American poetry and continues to influence writers today.',
    birth_year: 1830,
    death_year: 1886,
    nationality: 'American',
    image_url: '/images/emily-dickinson.jpg',
  },
  {
    name: 'Edgar Allan Poe',
    slug: 'edgar-allan-poe',
    bio: 'Edgar Allan Poe was an American writer, poet, and literary critic who pioneered the modern detective story and master of gothic atmosphere. His innovative use of mood and atmosphere created some of literature\'s most haunting and memorable verses, including "The Raven" and "Annabel Lee."',
    birth_year: 1809,
    death_year: 1849,
    nationality: 'American',
    image_url: '/images/edgar-allan-poe.jpg',
  },
  {
    name: 'William Wordsworth',
    slug: 'william-wordsworth',
    bio: 'William Wordsworth was a co-founder of Romanticism and a key figure in English literature. He believed poetry should use the language of ordinary people to express profound truths about nature, emotion, and the human experience. His "Lyrical Ballads" revolutionized poetry.',
    birth_year: 1770,
    death_year: 1850,
    nationality: 'British',
    image_url: '/images/william-wordsworth.jpg',
  },
]

async function seedPoets() {
  console.log('[v0] Starting poet seeding...')

  for (const poet of poets) {
    const { data, error } = await supabase
      .from('poets')
      .upsert([poet], { onConflict: 'slug' })

    if (error) {
      console.error(`[v0] Error seeding ${poet.name}:`, error)
    } else {
      console.log(`[v0] Successfully seeded ${poet.name}`)
    }
  }

  console.log('[v0] Poet seeding complete!')
  process.exit(0)
}

seedPoets().catch((err) => {
  console.error('[v0] Seed failed:', err)
  process.exit(1)
})

import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function sitemap() {
  const supabase = await createServerSupabaseClient()
  const baseUrl = 'https://wordstack.app'

  // Fetch all poets, poems, and themes
  const [poetsRes, poemsRes, themesRes, erasRes] = await Promise.all([
    supabase.from('poets').select('slug, updated_at'),
    supabase.from('poems').select('slug, updated_at').eq('is_published', true),
    supabase.from('themes').select('slug, created_at'),
    supabase.from('literary_eras').select('slug, created_at'),
  ])

  const poets = poetsRes.data || []
  const poems = poemsRes.data || []
  const themes = themesRes.data || []
  const eras = erasRes.data || []

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/classics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/poets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/themes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/modern`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Poet pages
  const poetPages = poets.map((poet) => ({
    url: `${baseUrl}/poets/${poet.slug}`,
    lastModified: poet.updated_at ? new Date(poet.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Poem pages
  const poemPages = poems.map((poem) => ({
    url: `${baseUrl}/poems/${poem.slug}`,
    lastModified: poem.updated_at ? new Date(poem.updated_at) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  // Theme pages
  const themePages = themes.map((theme) => ({
    url: `${baseUrl}/themes/${theme.slug}`,
    lastModified: theme.created_at ? new Date(theme.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Era pages
  const eraPages = eras.map((era) => ({
    url: `${baseUrl}/eras/${era.slug}`,
    lastModified: era.created_at ? new Date(era.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...poetPages, ...poemPages, ...themePages, ...eraPages]
}

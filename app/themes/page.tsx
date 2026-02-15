import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Poetry Themes | WordStack',
  description: 'Browse poetry organized by theme. Discover love poems, nature poetry, and more.',
  openGraph: {
    title: 'Poetry Themes | WordStack',
    description: 'Browse classic poetry organized by theme',
  },
}

async function getThemes() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('themes')
    .select('*, poem_themes(id)')
    .order('name', { ascending: true })

  return data || []
}

export default async function ThemesPage() {
  const themes = await getThemes()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Browse by Theme</h1>
          <p className="mt-4 text-muted-foreground">
            Explore poetry organized by central themes and subjects. Discover poems about love,
            nature, death, and more.
          </p>
        </div>
      </section>

      {/* Themes Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {themes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {themes.map((theme) => (
                <Button
                  key={theme.id}
                  asChild
                  variant="outline"
                  className="h-auto justify-start p-6"
                >
                  <Link href={`/themes/${theme.slug}`}>
                    <div>
                      <h3 className="font-semibold">{theme.name}</h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {theme.description}
                      </p>
                      <p className="mt-3 text-xs font-medium">
                        {theme.poem_themes?.length || 0} poem{theme.poem_themes?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">No themes available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

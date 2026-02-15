import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

async function getTheme(slug: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    notFound()
  }

  return data
}

async function getThemePoems(themeId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('poem_themes')
    .select('poems(*, poets(name, slug))')
    .eq('theme_id', themeId)
    .eq('poems.is_published', true)

  if (error) {
    return []
  }

  return data?.map((item) => item.poems) || []
}

async function getRelatedThemes(themeId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('themes')
    .select('*')
    .neq('id', themeId)
    .limit(3)

  return data || []
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const theme = await getTheme(params.slug)

  return {
    title: `${theme.name} Poems | WordStack`,
    description: theme.description || `Read poems about ${theme.name}`,
    openGraph: {
      title: `${theme.name} Poems | WordStack`,
      description: `Explore poems themed around ${theme.name}`,
    },
  }
}

export default async function ThemePage({ params }: { params: { slug: string } }) {
  const theme = await getTheme(params.slug)
  const poems = await getThemePoems(theme.id)
  const relatedThemes = await getRelatedThemes(theme.id)

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/themes" className="hover:text-foreground">
            Themes
          </Link>
          <span>/</span>
          <span>{theme.name}</span>
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{theme.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {theme.description}
          </p>
          {poems.length > 0 && (
            <p className="mt-6 text-sm font-semibold">
              {poems.length} poem{poems.length !== 1 ? 's' : ''} with this theme
            </p>
          )}
        </div>
      </section>

      {/* Poems Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {poems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {poems.map((poem) => (
                <Card key={poem?.id} className="flex flex-col p-6">
                  <Link href={`/poems/${poem?.slug}`} className="group">
                    <h3 className="text-lg font-bold group-hover:text-primary">
                      {poem?.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    by{' '}
                    <Link
                      href={`/poets/${poem?.poets?.slug}`}
                      className="hover:text-primary"
                    >
                      {poem?.poets?.name}
                    </Link>
                  </p>
                  <p className="mt-4 flex-1 text-sm line-clamp-3">
                    {poem?.summary}
                  </p>
                  <Button asChild variant="link" className="mt-4 w-fit">
                    <Link href={`/poems/${poem?.slug}`}>
                      Read Full Poem →
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">
                No poems found for this theme yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related Themes */}
      {relatedThemes.length > 0 && (
        <section className="border-t border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold">Related Themes</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedThemes.map((relatedTheme) => (
                <Button
                  key={relatedTheme.id}
                  asChild
                  variant="outline"
                  className="h-auto justify-start p-6"
                >
                  <Link href={`/themes/${relatedTheme.slug}`}>
                    <div>
                      <h3 className="font-semibold">{relatedTheme.name}</h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {relatedTheme.description}
                      </p>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

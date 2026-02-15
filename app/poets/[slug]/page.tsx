import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

async function getPoet(slug: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('poets')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    notFound()
  }

  return data
}

async function getPoetPoemsAndRelated(poetId: string) {
  const supabase = await createServerSupabaseClient()

  const poemsRes = await supabase
    .from('poems')
    .select('*')
    .eq('poet_id', poetId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return {
    poems: poemsRes.data || [],
  }
}

async function getRelatedThemes(poetId: string) {
  const supabase = await createServerSupabaseClient()

  // Get themes associated with this poet's poems
  const poemsRes = await supabase
    .from('poems')
    .select('id')
    .eq('poet_id', poetId)
    .eq('is_published', true)

  if (!poemsRes.data || poemsRes.data.length === 0) return []

  const poemIds = poemsRes.data.map((p) => p.id)

  const themesRes = await supabase
    .from('poem_themes')
    .select('theme_id')
    .in('poem_id', poemIds)

  const themeIds = [...new Set(themesRes.data?.map((r) => r.theme_id) || [])]

  if (themeIds.length === 0) return []

  const themeDetailsRes = await supabase
    .from('themes')
    .select('*')
    .in('id', themeIds)
    .limit(5)

  return themeDetailsRes.data || []
}

async function getRelatedPoets(eraId?: string, excludeId?: string) {
  const supabase = await createServerSupabaseClient()

  let query = supabase.from('poets').select('*').limit(3)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data } = await query

  return data || []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const poet = await getPoet(slug)

  return {
    title: `${poet.name} Poems | WordStack`,
    description: `Read poems by ${poet.name}. ${poet.bio?.substring(0, 120)}...`,
    openGraph: {
      title: `${poet.name} Poems | WordStack`,
      description: `Explore the complete collection of ${poet.name}'s poetry on WordStack.`,
    },
  }
}

export default async function PoetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const poet = await getPoet(slug)
  const { poems } = await getPoetPoemsAndRelated(poet.id)
  const themes = await getRelatedThemes(poet.id)
  const relatedPoets = await getRelatedPoets(poet.era_id, poet.id)

  const years =
    poet.birth_year && poet.death_year ? `${poet.birth_year}–${poet.death_year}` : 'Classical Era'

  // JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: poet.name,
    birthDate: poet.birth_year ? `${poet.birth_year}-01-01` : undefined,
    deathDate: poet.death_year ? `${poet.death_year}-01-01` : undefined,
    nationality: poet.nationality,
    description: poet.bio,
    image: poet.image_url,
    url: `https://wordstack.app/poets/${poet.slug}`,
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb */}
      <nav className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/poets" className="hover:text-foreground">
              Poets
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{poet.name}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {/* Portrait */}
            <div className="md:col-span-1">
              {poet.image_url && (
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={poet.image_url}
                    alt={poet.name}
                    fill
                    className="object-cover grayscale"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-foreground">{poet.name}</h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <Badge variant="secondary">{years}</Badge>
                {poet.nationality && <Badge variant="secondary">{poet.nationality}</Badge>}
              </div>

              <p className="mt-6 text-lg leading-relaxed text-foreground">{poet.bio}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button asChild>
                  <Link href={`#poems`}>Browse All Poems</Link>
                </Button>
                {themes.length > 0 && (
                  <Button asChild variant="outline">
                    <Link href={`/themes/${themes[0]?.slug}`}>
                      Explore {themes[0]?.name} Poems
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Born</p>
              <p className="mt-2 text-lg font-semibold">{poet.birth_year || 'Unknown'}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Died</p>
              <p className="mt-2 text-lg font-semibold">{poet.death_year || 'Unknown'}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Known For</p>
              <p className="mt-2 text-lg font-semibold">{themes[0]?.name || 'Poetry'}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Poems</p>
              <p className="mt-2 text-lg font-semibold">{poems.length}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">About {poet.name}</h2>
          <div className="mt-8 max-w-3xl space-y-4 text-lg leading-relaxed text-foreground">
            <p>
              {poet.bio}
            </p>
            <p>
              The works of {poet.name} remain central to the study of English literature. Their
              influence extends across centuries, inspiring countless writers and readers to explore
              the depths of human emotion and experience.
            </p>
          </div>
        </div>
      </section>

      {/* Poems Section */}
      <section id="poems" className="border-b border-border py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">
            Poems by {poet.name}
            <span className="ml-3 text-muted-foreground text-2xl">({poems.length})</span>
          </h2>

          {poems.length > 0 ? (
            <div className="mt-12 space-y-4">
              {poems.map((poem) => (
                <Card key={poem.id} className="p-6 hover:shadow-md transition-shadow">
                  <Link
                    href={`/poems/${poem.slug}`}
                    className="group block"
                  >
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {poem.title}
                    </h3>
                  </Link>
                  <p className="mt-3 text-muted-foreground line-clamp-2">{poem.summary}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {poem.line_count || 0} lines • {Math.ceil((poem.word_count || 0) / 200)} min read
                    </div>
                    <Button asChild variant="link" size="sm">
                      <Link href={`/poems/${poem.slug}`}>
                        Read <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">No poems found for this poet yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Themes Section */}
      {themes.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold">Explore Themes</h2>
            <p className="mt-2 text-muted-foreground">
              Recurring themes and subjects in {poet.name}&apos;s poetry
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {themes.map((theme) => (
                <Button
                  key={theme.id}
                  asChild
                  variant="outline"
                  className="h-auto justify-start p-4"
                >
                  <Link href={`/themes/${theme.slug}`}>
                    <div>
                      <h3 className="font-semibold text-foreground">{theme.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {theme.description}
                      </p>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Poets Section */}
      {relatedPoets.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold">Poets Like {poet.name}</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedPoets.map((relatedPoet) => (
                <Card key={relatedPoet.id} className="p-6 text-center">
                  {relatedPoet.image_url && (
                    <div className="relative h-24 w-24 mx-auto overflow-hidden rounded-full mb-4">
                      <Image
                        src={relatedPoet.image_url}
                        alt={relatedPoet.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold">
                    <Link href={`/poets/${relatedPoet.slug}`} className="hover:text-primary">
                      {relatedPoet.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {relatedPoet.birth_year && relatedPoet.death_year
                      ? `${relatedPoet.birth_year}–${relatedPoet.death_year}`
                      : 'Classical Era'}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Public Domain Notice */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
            <p>
              The works of {poet.name} are in the public domain and may be freely shared and
              reproduced.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

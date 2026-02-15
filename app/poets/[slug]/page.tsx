import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

  const [poemsRes, relatedRes] = await Promise.all([
    supabase
      .from('poems')
      .select('*')
      .eq('poet_id', poetId)
      .eq('is_published', true),
    supabase
      .from('poem_themes')
      .select('theme_id')
      .in('poem_id', (await supabase.from('poems').select('id').eq('poet_id', poetId)).data?.map((p) => p.id) || []),
  ])

  return {
    poems: poemsRes.data || [],
    themes: [...new Set(relatedRes.data?.map((r) => r.theme_id) || [])],
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const poet = await getPoet(params.slug)

  return {
    title: `${poet.name} Poems | WordStack`,
    description: `Read poems by ${poet.name}. ${poet.bio?.substring(0, 120)}...`,
    openGraph: {
      title: `${poet.name} Poems | WordStack`,
      description: `Explore the complete collection of ${poet.name}'s poetry`,
    },
  }
}

export default async function PoetPage({ params }: { params: { slug: string } }) {
  const poet = await getPoet(params.slug)
  const { poems } = await getPoetPoemsAndRelated(poet.id)

  const years =
    poet.birth_year && poet.death_year ? `${poet.birth_year}–${poet.death_year}` : 'Classical Era'

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/poets" className="hover:text-foreground">
            Poets
          </Link>
          <span>/</span>
          <span>{poet.name}</span>
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex gap-8 md:items-start">
            {poet.image_url && (
              <img
                src={poet.image_url}
                alt={poet.name}
                className="h-40 w-40 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{poet.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{years}</p>
              {poet.nationality && (
                <p className="mt-1 text-muted-foreground">{poet.nationality}</p>
              )}
              <p className="mt-6 max-w-2xl leading-relaxed">{poet.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Poems */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">
            Poems by {poet.name}
            {poems.length > 0 && (
              <span className="text-muted-foreground"> ({poems.length})</span>
            )}
          </h2>

          {poems.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {poems.map((poem) => (
                <Card key={poem.id} className="flex flex-col p-6">
                  <Link href={`/poems/${poem.slug}`} className="group">
                    <h3 className="text-lg font-bold group-hover:text-primary">
                      {poem.title}
                    </h3>
                  </Link>
                  <p className="mt-4 flex-1 text-sm line-clamp-3">
                    {poem.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{poem.line_count || 0} lines</span>
                    <Button asChild variant="link" className="p-0">
                      <Link href={`/poems/${poem.slug}`}>
                        Read Full Poem →
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

      {/* Related Poets */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Explore More Poets</h2>
          <Button asChild className="mt-6">
            <Link href="/poets">View All Poets</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

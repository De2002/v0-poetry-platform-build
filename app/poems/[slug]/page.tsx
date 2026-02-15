import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { PoemInteractions } from '@/components/poem-interactions'
import { PoemComments } from '@/components/poem-comments'

async function getPoem(slug: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('poems')
    .select('*, poets(name, slug, bio, birth_year, death_year)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !data) {
    notFound()
  }

  return data
}

async function getRelatedContent(poemId: string) {
  const supabase = await createServerSupabaseClient()

  const [themesRes, relatedPoemsRes] = await Promise.all([
    supabase.from('poem_themes').select('theme_id, themes(id, name, slug)').eq('poem_id', poemId),
    supabase
      .from('poem_themes')
      .select('poems(id, title, slug), theme_id')
      .eq('poem_id', poemId)
      .limit(3),
  ])

  return {
    themes: themesRes.data?.map((t) => t.themes) || [],
    relatedPoems: relatedPoemsRes.data || [],
  }
}

async function getPoemStats(poemId: string) {
  const supabase = await createServerSupabaseClient()

  const [likesRes, commentsRes] = await Promise.all([
    supabase.from('poem_likes').select('id', { count: 'exact', head: true }).eq('poem_id', poemId),
    supabase.from('poem_comments').select('id', { count: 'exact', head: true }).eq('poem_id', poemId),
  ])

  return {
    likes: likesRes.count || 0,
    comments: commentsRes.count || 0,
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const poem = await getPoem(slug)

  return {
    title: `${poem.title} - ${poem.poets?.name} | WordStack`,
    description: poem.meta_description || poem.summary || `Read ${poem.title} by ${poem.poets?.name}`,
    openGraph: {
      title: `${poem.title} by ${poem.poets?.name}`,
      description: poem.meta_description || poem.summary,
    },
  }
}

export default async function PoemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const poem = await getPoem(slug)
  const { themes } = await getRelatedContent(poem.id)
  const { likes, comments } = await getPoemStats(poem.id)

  // Create structured data (JSON-LD) for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: poem.title,
    description: poem.summary,
    author: {
      '@type': 'Person',
      name: poem.poets?.name,
    },
    datePublished: poem.created_at,
    wordCount: poem.word_count,
    text: poem.text,
    inLanguage: 'en',
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Breadcrumb */}
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/classics" className="hover:text-foreground">
            Poems
          </Link>
          <span>/</span>
          <Link
            href={`/poets/${poem.poets?.slug}`}
            className="hover:text-foreground"
          >
            {poem.poets?.name}
          </Link>
          <span>/</span>
          <span>{poem.title}</span>
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold">{poem.title}</h1>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-lg text-muted-foreground">by</p>
              <Link
                href={`/poets/${poem.poets?.slug}`}
                className="text-2xl font-semibold hover:text-primary"
              >
                {poem.poets?.name}
              </Link>
            </div>
            {/* Interactions */}
            <PoemInteractions poemId={poem.id} poemTitle={poem.title} initialLikes={likes} />
          </div>
        </div>
      </section>

      {/* Introduction */}
      {poem.intro && (
        <section className="border-b border-border bg-muted/50">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold">About This Poem</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {poem.intro}
            </p>
          </div>
        </section>
      )}

      {/* Poem Text */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-muted/30 p-8">
            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
              {poem.text}
            </div>
          </div>
        </div>
      </section>

      {/* Summary and Details */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Summary */}
            {poem.summary && (
              <div>
                <h2 className="text-2xl font-bold">Summary</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {poem.summary}
                </p>
              </div>
            )}

            {/* Poem Details */}
            <div>
              <h2 className="text-2xl font-bold">Poem Details</h2>
              <div className="mt-4 space-y-3">
                {poem.word_count && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Word Count
                    </p>
                    <p className="text-lg">{poem.word_count} words</p>
                  </div>
                )}
                {poem.line_count && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Lines
                    </p>
                    <p className="text-lg">{poem.line_count} lines</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Themes */}
      {themes.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold">Themes</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {themes.map((theme) => (
                <Button
                  key={theme?.id}
                  asChild
                  variant="secondary"
                >
                  <Link href={`/themes/${theme?.slug}`}>
                    {theme?.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold">What is the meaning of this poem?</h3>
              <p className="mt-3 text-muted-foreground">
                {poem.summary ||
                  'This poem explores themes that resonate across centuries. Readers are encouraged to find their own interpretation.'}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold">
                When was this poem written?
              </h3>
              <p className="mt-3 text-muted-foreground">
                This classic poem was written by {poem.poets?.name}
                {poem.poets?.birth_year && ` (${poem.poets.birth_year}-${poem.poets.death_year})`}.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold">Can I use this poem?</h3>
              <p className="mt-3 text-muted-foreground">
                This is a classic poem in the public domain. You're free to use, share, and adapt it
                for any purpose.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Comments ({comments})</h2>
          <PoemComments poemId={poem.id} />
        </div>
      </section>

      {/* About the Poet */}
      {poem.poets && (
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold">About the Poet</h2>
              <h3 className="mt-4 text-xl font-semibold">
                <Link
                  href={`/poets/${poem.poets.slug}`}
                  className="hover:text-primary"
                >
                  {poem.poets.name}
                </Link>
              </h3>
              <p className="mt-2 text-muted-foreground">
                {poem.poets.birth_year && poem.poets.death_year
                  ? `${poem.poets.birth_year} – ${poem.poets.death_year}`
                  : 'Classical Era'}
              </p>
              <p className="mt-4 leading-relaxed">
                {poem.poets.bio}
              </p>
              <Button asChild className="mt-6">
                <Link href={`/poets/${poem.poets.slug}`}>
                  View All Poems by {poem.poets.name}
                </Link>
              </Button>
            </Card>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
            <h2 className="text-2xl font-bold">Enjoy Poetry?</h2>
            <p className="mt-3 text-muted-foreground">
              Create an account to save your favorite poems and share your own poetry.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/auth/signup">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

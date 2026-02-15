import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Classic Poems | WordStack',
  description:
    'Browse the complete collection of classic public domain poetry. Thousands of poems by the world\'s greatest poets.',
  openGraph: {
    title: 'Classic Poems | WordStack',
    description: 'The complete collection of classic public domain poetry',
  },
}

async function getClassicPoems() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('poems')
    .select('*, poets(name, slug)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return data || []
}

export default async function ClassicsPage() {
  const poems = await getClassicPoems()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Classic Poems</h1>
          <p className="mt-4 text-muted-foreground">
            Explore the complete collection of public domain poetry. From Shakespeare to Emily Dickinson,
            all your favorite classic poems in one place.
          </p>
        </div>
      </section>

      {/* Poems Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {poems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {poems.map((poem) => (
                <Card key={poem.id} className="flex flex-col overflow-hidden">
                  <div className="flex flex-1 flex-col p-6">
                    <Link href={`/poems/${poem.slug}`} className="group">
                      <h2 className="text-lg font-bold group-hover:text-primary">
                        {poem.title}
                      </h2>
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      by{' '}
                      <Link
                        href={`/poets/${poem.poets?.slug}`}
                        className="hover:text-primary"
                      >
                        {poem.poets?.name}
                      </Link>
                    </p>
                    <p className="mt-4 flex-1 text-sm line-clamp-3">
                      {poem.summary}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{poem.line_count || 0} lines</span>
                      <span>{poem.word_count || 0} words</span>
                    </div>
                  </div>
                  <div className="border-t border-border p-4">
                    <Button asChild className="w-full" variant="ghost">
                      <Link href={`/poems/${poem.slug}`}>
                        Read Poem
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">No poems found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

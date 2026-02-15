import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Poets | WordStack',
  description: 'Browse the complete collection of classic poets and their works on WordStack.',
  openGraph: {
    title: 'Poets | WordStack',
    description: 'Browse the complete collection of classic poets',
  },
}

async function getPoets() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('poets')
    .select('*, poems(id)')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching poets:', error)
    return []
  }

  return data || []
}

export default async function PoetsPage() {
  const poets = await getPoets()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Classic Poets</h1>
          <p className="mt-4 text-muted-foreground">
            Explore the complete collection of classic poets whose works have shaped literature.
          </p>
        </div>
      </section>

      {/* Poets Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {poets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {poets.map((poet) => (
                <Card key={poet.id} className="flex flex-col overflow-hidden">
                  <div className="flex flex-1 flex-col p-6">
                    <Link href={`/poets/${poet.slug}`} className="group">
                      <h2 className="text-xl font-bold group-hover:text-primary">
                        {poet.name}
                      </h2>
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {poet.birth_year && poet.death_year
                        ? `${poet.birth_year} – ${poet.death_year}`
                        : 'Classical Era'}
                    </p>
                    {poet.nationality && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {poet.nationality}
                      </p>
                    )}
                    <p className="mt-4 flex-1 text-sm line-clamp-3">
                      {poet.bio}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{poet.poems?.length || 0} poems</span>
                    </div>
                  </div>
                  <div className="border-t border-border p-4">
                    <Button asChild className="w-full" variant="ghost">
                      <Link href={`/poets/${poet.slug}`}>
                        View Poet
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">No poets found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

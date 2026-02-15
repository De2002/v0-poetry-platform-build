import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Literary Eras | WordStack',
  description: 'Explore poetry organized by literary era. Romantic, Victorian, Modernist, and more.',
}

async function getEras() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('literary_eras')
    .select('*')
    .order('start_year', { ascending: true })

  return data || []
}

export default async function ErasPage() {
  const eras = await getEras()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Literary Eras</h1>
          <p className="mt-4 text-muted-foreground">
            Explore poetry organized by literary era. Each era shaped poetry in unique ways,
            reflecting the values and concerns of its time.
          </p>
        </div>
      </section>

      {/* Eras Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {eras.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {eras.map((era) => (
                <Card key={era.id} className="flex flex-col p-6">
                  <h2 className="text-2xl font-bold">{era.name}</h2>
                  {era.start_year && era.end_year && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {era.start_year} – {era.end_year}
                    </p>
                  )}
                  <p className="mt-4 flex-1 leading-relaxed">
                    {era.description}
                  </p>
                  <Button asChild className="mt-6 w-fit">
                    <Link href={`/eras/${era.slug}`}>
                      Explore Era
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">No eras found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

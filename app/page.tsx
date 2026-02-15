import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, BookOpen, Users, Lightbulb, Share2 } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'

async function getFeaturedContent() {
  const supabase = await createServerSupabaseClient()

  const [poetsRes, poemsRes, themesRes] = await Promise.all([
    supabase.from('poets').select('*').limit(3),
    supabase.from('poems').select('*, poets(name, slug)').eq('is_published', true).limit(6),
    supabase.from('themes').select('*').limit(5),
  ])

  return {
    poets: poetsRes.data || [],
    poems: poemsRes.data || [],
    themes: themesRes.data || [],
  }
}

export default async function HomePage() {
  const { poets, poems, themes } = await getFeaturedContent()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              The World's Most Structured Poetry Archive
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Explore over 1,000 classic poems from the world's greatest poets. Discover modern poetry from emerging voices. All searchable, tagged, and optimized for discovery.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg">
                <Link href="/classics">
                  Browse Classics <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/modern">Discover Modern Poetry</Link>
              </Button>
            </div>
          </div>

          {/* Classic Poets Showcase */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Emily Dickinson',
                years: '1830–1886',
                bio: 'A master of introspection and innovation, Dickinson revolutionized poetry with her unique form and profound observations of the human soul.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
              },
              {
                name: 'Edgar Allan Poe',
                years: '1809–1849',
                bio: 'Pioneer of the modern detective story and master of gothic atmosphere, Poe created some of literature\'s most haunting and memorable verses.',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop',
              },
              {
                name: 'William Wordsworth',
                years: '1770–1850',
                bio: 'Co-founder of Romanticism, Wordsworth believed poetry should use the language of ordinary people to express profound truths about nature and emotion.',
                image: 'https://images.unsplash.com/photo-1507842872343-583f20270319?w=300&h=400&fit=crop',
              },
            ].map((poet) => (
              <Card key={poet.name} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <Image
                    src={poet.image}
                    alt={poet.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-bold text-lg">{poet.name}</h3>
                  <p className="text-sm text-muted-foreground">{poet.years}</p>
                  <p className="mt-3 text-sm leading-relaxed flex-1">{poet.bio}</p>
                  <Button asChild variant="link" className="mt-4 w-fit">
                    <Link href={`/poets/${poet.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      View Poems <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-bold sm:text-4xl">Why WordStack?</h2>
          <p className="mt-4 text-muted-foreground">
            A platform built for poetry lovers, researchers, and anyone seeking the beauty of great verse.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: 'Complete Archive',
                description: 'Every classic poem in the public domain, fully searchable and organized.',
              },
              {
                icon: Users,
                title: 'Share & Discover',
                description: 'Create collections, follow poets, and share your favorite works with others.',
              },
              {
                icon: Lightbulb,
                title: 'Smart Organization',
                description: 'Poems organized by theme, era, poet, and style for easy exploration.',
              },
              {
                icon: Share2,
                title: 'Community',
                description: 'Join a community of modern poets sharing original verse daily.',
              },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="flex flex-col p-6">
                  <Icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Poets */}
      {poets.length > 0 && (
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Featured Poets</h2>
              <Button asChild variant="outline">
                <Link href="/poets">View All Poets</Link>
              </Button>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {poets.map((poet) => (
                <Card key={poet.id} className="p-6 text-center">
                  {poet.image_url && (
                    <Image
                      src={poet.image_url}
                      alt={poet.name}
                      width={100}
                      height={100}
                      className="mx-auto h-24 w-24 rounded-full object-cover"
                    />
                  )}
                  <h3 className="mt-4 font-bold">
                    <Link href={`/poets/${poet.slug}`} className="hover:text-primary">
                      {poet.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {poet.birth_year && poet.death_year
                      ? `${poet.birth_year} – ${poet.death_year}`
                      : 'Classical Era'}
                  </p>
                  <p className="mt-3 text-sm line-clamp-2">{poet.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Poems */}
      {poems.length > 0 && (
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Popular Poems</h2>
              <Button asChild variant="outline">
                <Link href="/classics">View All Poems</Link>
              </Button>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {poems.map((poem) => (
                <Card key={poem.id} className="flex flex-col p-6">
                  <Link href={`/poems/${poem.slug}`} className="group">
                    <h3 className="font-bold group-hover:text-primary">
                      {poem.title}
                    </h3>
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
                  <p className="mt-4 flex-1 text-sm line-clamp-3">{poem.summary}</p>
                  <Button asChild variant="link" className="mt-4 w-fit">
                    <Link href={`/poems/${poem.slug}`}>Read Full Poem</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Theme */}
      {themes.length > 0 && (
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold">Browse by Theme</h2>
            <p className="mt-2 text-muted-foreground">
              Discover poems by their central themes and subjects.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-muted/50 p-12 text-center">
            <h2 className="text-3xl font-bold">Share Your Poetry</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of poets sharing their work with a community of passionate readers.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

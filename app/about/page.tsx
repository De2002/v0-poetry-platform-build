import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'About WordStack | Poetry Platform',
  description:
    'WordStack is the most structured, SEO-optimized public domain poetry archive online. Discover classic poems and modern poetry.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">About WordStack</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The world's most structured poetry archive, built for discovery and community.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            WordStack was created with a simple goal: to make every classic poem in the public domain easily
            discoverable through SEO-optimized pages. We believe poetry deserves better infrastructure.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Unlike traditional poetry sites, WordStack is built from the ground up for search engines and
            readers alike. Every poem is properly tagged, themed, and structured with rich metadata so that
            search engines can understand and rank the content naturally.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">What Makes WordStack Different</h2>
          <div className="mt-12 space-y-6">
            {[
              {
                title: 'Structured Data',
                description:
                  'Every poem includes rich structured data (schema markup) so search engines understand the content deeply.',
              },
              {
                title: 'SEO-First Architecture',
                description:
                  'Clean URLs, proper heading hierarchy, fast loading times, and mobile optimization built in from day one.',
              },
              {
                title: 'Complete Tagging',
                description:
                  'Every poem is tagged with themes, literary eras, and related works for maximum discoverability.',
              },
              {
                title: 'Community-Driven',
                description:
                  'Users can create collections, follow poets, share discoveries, and publish original poetry.',
              },
              {
                title: 'Public Domain Only',
                description:
                  'All classic poems are in the public domain. You can read, share, and adapt them freely.',
              },
              {
                title: 'Modern & Classic',
                description:
                  'Browse hundreds of classic poems, and discover contemporary poetry from an emerging community.',
              },
            ].map((feature) => (
              <Card key={feature.title} className="p-6">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Our Content</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">1000+</div>
              <p className="mt-2 text-muted-foreground">Classic Poems</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">200+</div>
              <p className="mt-2 text-muted-foreground">Poets</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">50+</div>
              <p className="mt-2 text-muted-foreground">Themes</p>
            </div>
          </div>
          <p className="mt-12 leading-relaxed text-muted-foreground">
            WordStack features the complete collection of public domain classic poetry, from Shakespeare
            and Emily Dickinson to Edgar Allan Poe and William Wordsworth. Every poem is fully searchable
            and organized by theme, era, and poet.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-muted/50 p-12 text-center">
            <h2 className="text-3xl font-bold">Ready to Explore?</h2>
            <p className="mt-4 text-muted-foreground">
              Start discovering classic poetry or sharing your own work with our community.
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <Button asChild>
                <Link href="/classics">Browse Classics</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/modern">Modern Poetry</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

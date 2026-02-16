import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/dashboard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export default async function HomePage() {
  const user = await getUser()

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard user={user} />
  }

  // Otherwise show landing page
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
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
        </div>
      </section>

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

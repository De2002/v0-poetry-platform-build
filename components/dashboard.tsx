'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookOpen, MessageSquare, Heart, Settings, LogOut, Plus, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const QUOTES_OF_THE_DAY = [
  {
    text: "Poetry is the most immediate way of speaking one's truth.",
    author: 'Maya Angelou',
  },
  {
    text: 'A poet is someone who can make you laugh and cry and believe in something all at once.',
    author: 'Maya Angelou',
  },
  {
    text: 'Poetry is when emotion has found its thought and thought has found words.',
    author: 'Robert Frost',
  },
  {
    text: 'A poem is a small profound personal essay in regards to a fragment of truth.',
    author: 'Anne Sexton',
  },
  {
    text: 'Poetry is the art of creating imaginative awareness of experience.',
    author: 'Edward Hirsch',
  },
]

export function Dashboard({ user, isAdmin = false }: { user: any; isAdmin?: boolean }) {
  const router = useRouter()
  const supabase = createClient()
  const today = new Date().getDate()
  const quote = QUOTES_OF_THE_DAY[today % QUOTES_OF_THE_DAY.length]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.email?.split('@')[0]}</h1>
              <p className="text-sm text-muted-foreground">Your poetry workspace</p>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Platform
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Quote of the Day */}
        <section className="mb-12">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
            <div className="text-center">
              <p className="text-xl italic text-foreground">"{quote.text}"</p>
              <p className="mt-4 text-sm text-muted-foreground">— {quote.author}</p>
            </div>
          </Card>
        </section>

        {/* Dashboard Grid */}
        <div className="space-y-8">
          {/* My Content Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">My Content</h2>
              <p className="text-muted-foreground">Manage your poems and contributions</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* My Poems */}
              <Card className="flex flex-col p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">My Poems</h3>
                    <p className="text-xs text-muted-foreground">Create and manage your poetry</p>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">
                  Write, edit, and publish your original poems to share with the community.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/poems">View My Poems</Link>
                </Button>
              </Card>

              {/* My Comments */}
              <Card className="flex flex-col p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">My Comments</h3>
                    <p className="text-xs text-muted-foreground">Discussions and feedback</p>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">
                  View all your comments on poems and engage with the poetry community.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/comments">View Comments</Link>
                </Button>
              </Card>

              {/* My Favorites */}
              <Card className="flex flex-col p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-red-500/10 p-3">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">My Favorites</h3>
                    <p className="text-xs text-muted-foreground">Liked and bookmarked poems</p>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">
                  Access your collection of favorite poems from across the platform.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/favorites">View Favorites</Link>
                </Button>
              </Card>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Quick Actions</h2>
              <p className="text-muted-foreground">Get started with your next step</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Button asChild size="lg" className="h-auto flex-col items-start p-6">
                <Link href="/dashboard/poems/new">
                  <Plus className="mb-2 h-5 w-5" />
                  <span className="font-semibold">Write New Poem</span>
                  <span className="text-xs opacity-80">Create and publish your poetry</span>
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="h-auto flex-col items-start p-6">
                <Link href="/modern">
                  <BookOpen className="mb-2 h-5 w-5" />
                  <span className="font-semibold">Explore Poetry</span>
                  <span className="text-xs opacity-80">Discover poems from other poets</span>
                </Link>
              </Button>
            </div>
          </section>

          {/* Settings */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Account Settings</p>
                      <p className="text-sm text-muted-foreground">Update your profile and preferences</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/settings">Edit</Link>
                  </Button>
                </div>
              </Card>

              {isAdmin && (
                <Card className="p-6 border-primary/20 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Manage Platform</p>
                        <p className="text-sm text-muted-foreground">Admin tools and user management</p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/admin">Manage</Link>
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Users, FileText } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()

  // Fetch statistics
  const [
    { count: poemCount },
    { count: poetCount },
    { count: modernPoemCount },
  ] = await Promise.all([
    supabase
      .from('poems')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('poets')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('modern_poems')
      .select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    {
      label: 'Classic Poems',
      value: poemCount || 0,
      icon: BookOpen,
      href: '/admin/classics/poems',
    },
    {
      label: 'Classic Poets',
      value: poetCount || 0,
      icon: Users,
      href: '/admin/classics/poets',
    },
    {
      label: 'Modern Poems',
      value: modernPoemCount || 0,
      icon: FileText,
      href: '/admin/modern',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome to WordStack Admin</h2>
        <p className="text-muted-foreground">
          Manage classic poetry, poets, and modern poem submissions from here.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Button asChild variant="link" className="mt-4 p-0 h-auto">
                <Link href={stat.href}>Manage →</Link>
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/classics/poets/new">+ Add New Poet</Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/classics/poems/new">+ Add New Poem</Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/classics/poets">View All Poets</Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/classics/poems">View All Poems</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}

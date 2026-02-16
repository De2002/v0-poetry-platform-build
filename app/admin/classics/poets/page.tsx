import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit, Trash2, Plus } from 'lucide-react'

interface Poet {
  id: string
  name: string
  slug: string
  bio?: string
  birth_year?: number
  death_year?: number
  created_at: string
}

export default async function ClassicPoetsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: poets, error } = await supabase
    .from('poets')
    .select('id, name, slug, bio, birth_year, death_year, created_at')
    .order('name', { ascending: true })

  const poetsList = (poets as Poet[]) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Classic Poets</h2>
          <p className="text-muted-foreground mt-1">
            Manage classic poets and their information
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/classics/poets/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Poet
          </Link>
        </Button>
      </div>

      {/* Poets Table */}
      <Card className="overflow-hidden">
        {poetsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Life Span</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Added</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {poetsList.map((poet) => (
                  <tr key={poet.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/classics/poets/${poet.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {poet.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {poet.birth_year && poet.death_year
                        ? `${poet.birth_year} - ${poet.death_year}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(poet.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/classics/poets/${poet.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            // Delete handler will be implemented
                            console.log('Delete poet:', poet.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No poets found.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/classics/poets/new">Create First Poet</Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

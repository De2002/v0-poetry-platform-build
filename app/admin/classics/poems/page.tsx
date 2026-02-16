import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit, Trash2, Plus } from 'lucide-react'

interface Poem {
  id: string
  title: string
  slug: string
  poet_id: string
  poets?: { name: string }
  word_count?: number
  line_count?: number
  created_at: string
}

export const metadata = {
  title: 'Classic Poems',
}

export default async function ClassicPoemsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: poems, error } = await supabase
    .from('poems')
    .select('id, title, slug, poet_id, word_count, line_count, created_at, poets(name)')
    .order('created_at', { ascending: false })

  const poemsList = (poems as Poem[]) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Classic Poems</h2>
          <p className="text-muted-foreground mt-1">
            Manage classic poems and their metadata
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/classics/poems/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Poem
          </Link>
        </Button>
      </div>

      {/* Poems Table */}
      <Card className="overflow-hidden">
        {poemsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Poet</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Words</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Lines</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Added</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {poemsList.map((poem) => (
                  <tr key={poem.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/classics/poems/${poem.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {poem.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {poem.poets?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {poem.word_count || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {poem.line_count || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(poem.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/classics/poems/${poem.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            // Delete handler will be implemented
                            console.log('Delete poem:', poem.id)
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
            <p className="text-muted-foreground">No poems found.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/classics/poems/new">Create First Poem</Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

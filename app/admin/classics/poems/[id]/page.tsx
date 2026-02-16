import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PoemForm } from '@/components/poem-form'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Poem',
}

export default async function EditPoemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: poem, error } = await supabase
    .from('poems')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !poem) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Edit Poem</h2>
        <p className="text-muted-foreground mt-1">
          Update "{poem.title}"
        </p>
      </div>

      <PoemForm poem={poem} isEditing />
    </div>
  )
}

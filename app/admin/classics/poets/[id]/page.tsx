import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PoetForm } from '@/components/poet-form'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Poet',
}

export default async function EditPoetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: poet, error } = await supabase
    .from('poets')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !poet) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Edit Poet</h2>
        <p className="text-muted-foreground mt-1">
          Update {poet.name}'s information
        </p>
      </div>

      <PoetForm poet={poet} isEditing />
    </div>
  )
}

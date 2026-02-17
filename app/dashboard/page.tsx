import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/dashboard'

async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()
  return data
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const profile = await getUserProfile(user.id)

  return <Dashboard user={user} isAdmin={profile?.is_admin || false} />
}

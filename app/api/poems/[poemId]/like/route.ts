import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ poemId: string }> }
) {
  try {
    const { poemId } = await params
    const supabase = await createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('poem_likes')
      .select('id')
      .eq('poem_id', poemId)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      // Unlike
      await supabase
        .from('poem_likes')
        .delete()
        .eq('poem_id', poemId)
        .eq('user_id', user.id)

      // Get updated count
      const { count } = await supabase
        .from('poem_likes')
        .select('*', { count: 'exact', head: true })
        .eq('poem_id', poemId)

      return NextResponse.json({ liked: false, count: count || 0 })
    } else {
      // Like
      await supabase.from('poem_likes').insert({
        poem_id: poemId,
        user_id: user.id,
      })

      // Get updated count
      const { count } = await supabase
        .from('poem_likes')
        .select('*', { count: 'exact', head: true })
        .eq('poem_id', poemId)

      return NextResponse.json({ liked: true, count: count || 0 })
    }
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

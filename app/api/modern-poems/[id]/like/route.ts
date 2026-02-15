import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('modern_poem_likes')
      .select('id')
      .eq('poem_id', id)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      // Unlike
      await supabase
        .from('modern_poem_likes')
        .delete()
        .eq('poem_id', id)
        .eq('user_id', user.id)

      // Decrement count
      await supabase
        .from('modern_poems')
        .update({ likes_count: supabase.sql`likes_count - 1` })
        .eq('id', id)

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await supabase.from('modern_poem_likes').insert({
        poem_id: id,
        user_id: user.id,
      })

      // Increment count
      await supabase
        .from('modern_poems')
        .update({ likes_count: supabase.sql`likes_count + 1` })
        .eq('id', id)

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

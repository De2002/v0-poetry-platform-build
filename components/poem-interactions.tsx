'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Share2 } from 'lucide-react'
import { createClientSupabaseClient } from '@/lib/supabase/client'

export function PoemInteractions({
  poemId,
  poemTitle,
  initialLikes,
}: {
  poemId: string
  poemTitle: string
  initialLikes: number
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientSupabaseClient()

  // Check if user already liked
  useEffect(() => {
    const checkIfLiked = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return

      const { data: like } = await supabase
        .from('poem_likes')
        .select('id')
        .eq('poem_id', poemId)
        .eq('user_id', data.session.user.id)
        .single()

      setIsLiked(!!like)
    }

    checkIfLiked()
  }, [poemId])

  const handleLike = async () => {
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      window.location.href = '/auth/signup'
      return
    }

    setIsLoading(true)
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('poem_likes')
          .delete()
          .eq('poem_id', poemId)
          .eq('user_id', data.session.user.id)

        setIsLiked(false)
        setLikes((prev) => Math.max(0, prev - 1))
      } else {
        // Like
        await supabase.from('poem_likes').insert({
          poem_id: poemId,
          user_id: data.session.user.id,
        })

        setIsLiked(true)
        setLikes((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: poemTitle,
      text: `Check out "${poemTitle}" on WordStack`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }

    try {
      if (navigator.share) {
        // Native share sheet (mobile)
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error)
      }
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleLike}
        disabled={isLoading}
        className={isLiked ? 'text-red-600 bg-red-50 dark:bg-red-950' : ''}
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        {likes > 0 && <span className="ml-1 text-sm">{likes}</span>}
      </Button>
      <Button variant="outline" size="icon" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
}

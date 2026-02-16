'use client'

import { useState } from 'react'
import { Heart, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function PoemInteractions({ poemId }: { poemId: string }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const supabase = createClient()

  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Poem',
          text: 'Check out this poem on WordStack',
          url: window.location.href,
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="flex items-center gap-6 py-4 border-t border-border">
      <button
        onClick={handleLike}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : ''}`} />
        <span>{likeCount}</span>
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  )
}

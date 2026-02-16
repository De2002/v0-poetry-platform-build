'use client'

import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { useState } from 'react'

export function PoemInteractions({ poemId }: { poemId: string }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this poem',
          url: `${window.location.origin}/poems/${poemId}`,
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/poems/${poemId}`)
    }
  }

  return (
    <div className="flex gap-4 pt-4 border-t border-border">
      <button
        onClick={handleLike}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : ''}`} />
        <span>Like</span>
      </button>
      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <MessageCircle className="h-5 w-5" />
        <span>Comment</span>
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <Share2 className="h-5 w-5" />
        <span>Share</span>
      </button>
    </div>
  )
}

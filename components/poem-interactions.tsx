'use client'

import { useState } from 'react'
import { Heart, Share2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PoemInteractionsProps {
  poemId: string
  initialLikes?: number
  initialComments?: number
}

export function PoemInteractions({
  poemId,
  initialLikes = 0,
  initialComments = 0,
}: PoemInteractionsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes)

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    } catch (error) {
      console.error('Error toggling like:', error)
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this poem',
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
    <div className="flex items-center gap-4">
      <button
        onClick={handleLike}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <Heart
          className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : ''}`}
        />
        <span>{likeCount}</span>
      </button>

      <Link href="#comments" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <MessageCircle className="h-5 w-5" />
        <span>{initialComments}</span>
      </Link>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  )
}

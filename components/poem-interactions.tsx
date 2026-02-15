'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function PoemInteractions({
  poemId,
  initialLikes = 0,
  initialBookmarks = 0,
}: {
  poemId: string
  initialLikes?: number
  initialBookmarks?: number
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLike = async () => {
    setIsLoading(true)
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('poem_likes')
          .delete()
          .eq('poem_id', poemId)

        if (!error) {
          setIsLiked(false)
          setLikes(Math.max(0, likes - 1))
        }
      } else {
        // Like
        const { error } = await supabase
          .from('poem_likes')
          .insert({ poem_id: poemId })

        if (!error) {
          setIsLiked(true)
          setLikes(likes + 1)
        }
      }
    } catch (error) {
      console.error('Error updating like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookmark = async () => {
    setIsLoading(true)
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('poem_bookmarks')
          .delete()
          .eq('poem_id', poemId)

        if (!error) {
          setIsBookmarked(false)
          setBookmarks(Math.max(0, bookmarks - 1))
        }
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('poem_bookmarks')
          .insert({ poem_id: poemId })

        if (!error) {
          setIsBookmarked(true)
          setBookmarks(bookmarks + 1)
        }
      }
    } catch (error) {
      console.error('Error updating bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this poem',
          url: window.location.href,
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className="gap-2"
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span>{likes}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleBookmark}
        disabled={isLoading}
      >
        {isBookmarked ? '📌' : '📍'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

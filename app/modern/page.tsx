'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function ModernPage() {
  const [poems, setPoems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedPoem, setExpandedPoem] = useState<string | null>(null)
  const [likedPoems, setLikedPoems] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const response = await fetch('/api/modern-poems')
        if (!response.ok) throw new Error('Failed to fetch poems')
        const data = await response.json()
        setPoems(data)
      } catch (error) {
        console.error('Error fetching poems:', error)
        setPoems([])
      } finally {
        setLoading(false)
      }
    }

    fetchPoems()
  }, [])

  const handleLike = (poemId: string) => {
    const newLiked = new Set(likedPoems)
    if (newLiked.has(poemId)) {
      newLiked.delete(poemId)
    } else {
      newLiked.add(poemId)
    }
    setLikedPoems(newLiked)
  }

  const handleShare = async (poem: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poem.title,
          text: poem.content.substring(0, 100),
          url: `${window.location.origin}/modern-poems/${poem.id}`,
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/modern-poems/${poem.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Poetry Feed</h1>
            </div>
            <Button asChild>
              <Link href="/modern/submit">Share Poem</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="mx-auto max-w-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading poems...</p>
          </div>
        ) : poems.length > 0 ? (
          poems.map((poem, index) => {
            const timeAgo = formatDistanceToNow(new Date(poem.created_at), { addSuffix: true })
            const isExpanded = expandedPoem === poem.id
            const isLiked = likedPoems.has(poem.id)

            return (
              <div
                key={poem.id}
                className="border-b border-border px-4 py-6 sm:px-6 lg:px-8 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setExpandedPoem(isExpanded ? null : poem.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold">{poem.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Posted {timeAgo}
                    </p>
                  </div>
                  {!isExpanded && (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                  {isExpanded && (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {/* Poem Preview / Full */}
                <div
                  className={`whitespace-pre-wrap font-serif text-base leading-relaxed text-foreground mb-4 ${
                    isExpanded ? '' : 'line-clamp-3'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {poem.content}
                </div>

                {/* Engagement Bar */}
                <div
                  className="flex items-center justify-between text-sm text-muted-foreground pt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-6">
                    <button
                      onClick={() => handleLike(poem.id)}
                      className="flex items-center gap-2 hover:text-primary transition-colors group"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isLiked ? 'fill-primary text-primary' : 'group-hover:text-primary'
                        }`}
                      />
                      <span className={isLiked ? 'text-primary' : ''}>
                        {(poem.likes_count || 0) + (isLiked ? 1 : 0)}
                      </span>
                    </button>
                    <Link
                      href={`/modern-poems/${poem.id}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{poem.comments_count || 0}</span>
                    </Link>
                    <button
                      onClick={() => handleShare(poem)}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Link
                    href={`/modern-poems/${poem.id}`}
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View →
                  </Link>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No poems yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

interface ModernPoem {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  likes_count: number
  comments_count: number
}

interface Comment {
  id: string
  content: string
  user_id: string
  created_at: string
}

export default function ModernPoemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [poem, setPoem] = useState<ModernPoem | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (id) {
      fetchPoem()
      fetchComments()
    }
  }, [id])

  async function fetchPoem() {
    try {
      const { data, error } = await supabase
        .from('modern_poems')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setPoem(data)
      setLikeCount(data.likes_count || 0)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching poem:', error)
      setLoading(false)
    }
  }

  async function fetchComments() {
    try {
      const { data } = await supabase
        .from('modern_poem_comments')
        .select('*')
        .eq('poem_id', id)
        .order('created_at', { ascending: false })

      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  async function handleLike() {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? Math.max(0, likeCount - 1) : likeCount + 1)
  }

  async function handleShare() {
    if (navigator.share && poem) {
      try {
        await navigator.share({
          title: poem.title,
          text: poem.content.substring(0, 100),
          url: window.location.href,
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  async function handleComment() {
    if (!commentText.trim()) return

    try {
      const { data, error } = await supabase
        .from('modern_poem_comments')
        .insert([
          {
            poem_id: id,
            user_id: 'anonymous',
            content: commentText,
          },
        ])
        .select()

      if (error) throw error

      if (data) {
        setComments([data[0], ...comments])
        setCommentText('')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading poem...</p>
      </div>
    )
  }

  if (!poem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Poem not found</h1>
          <p className="mt-2 text-muted-foreground">The poem you're looking for doesn't exist.</p>
          <Button asChild className="mt-6">
            <Link href="/modern">Back to Feed</Link>
          </Button>
        </div>
      </div>
    )
  }

  const timeAgo = formatDistanceToNow(new Date(poem.created_at), { addSuffix: true })

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/modern" className="hover:text-foreground">
              Modern Feed
            </Link>
            <span>/</span>
            <span>{poem.title}</span>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{poem.title}</h1>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Published {timeAgo}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-primary text-primary' : ''}`} />
                {likeCount}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Poem Text Section */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-muted/30 p-8 md:p-12">
            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
              {poem.content}
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Metrics */}
      <section className="border-b border-border py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">{likeCount} like{likeCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Discussion</h2>

          {/* Comment Input */}
          <Card className="mb-8 p-6">
            <div className="space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this poem..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={handleComment} disabled={!commentText.trim()}>
                  Post Comment
                </Button>
              </div>
            </div>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id} className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold">Anonymous</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="leading-relaxed text-foreground">{comment.content}</p>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold">Share Your Poetry</h2>
            <p className="mt-3 text-muted-foreground">
              Have a poem you'd like to share with our community? Join WordStack and publish your work.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/modern/submit">
                Submit a Poem <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  )
}

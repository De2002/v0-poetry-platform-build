'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

export function PoemComments({ poemId }: { poemId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }

    // Fetch comments
    const fetchComments = async () => {
      const { data } = await supabase
        .from('poem_comments')
        .select('*, users(username, display_name)')
        .eq('poem_id', poemId)
        .order('created_at', { ascending: false })

      setComments(data || [])
    }

    getUser()
    fetchComments()
  }, [poemId])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      window.location.href = '/auth/signup'
      return
    }

    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const { data } = await supabase
        .from('poem_comments')
        .insert({
          poem_id: poemId,
          user_id: user.id,
          content: newComment,
        })
        .select('*, users(username, display_name)')
        .single()

      if (data) {
        setComments([data, ...comments])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Add Comment Form */}
      {user ? (
        <Card className="p-6">
          <form onSubmit={handleAddComment} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this poem..."
              className="w-full rounded-md border border-border bg-background p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <Button type="submit" disabled={isLoading || !newComment.trim()}>
              {isLoading ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">Sign in to leave a comment</p>
          <Button asChild>
            <a href="/auth/signup">Sign In</a>
          </Button>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {comment.users?.display_name || comment.users?.username || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="mt-4 leading-relaxed text-foreground">{comment.content}</p>
            </Card>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}

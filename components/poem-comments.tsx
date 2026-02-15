'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

export function PoemComments({ poemId }: { poemId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchComments()
  }, [poemId])

  async function fetchComments() {
    try {
      const { data } = await supabase
        .from('poem_comments')
        .select('*, profiles(username, avatar_url)')
        .eq('poem_id', poemId)
        .order('created_at', { ascending: false })

      setComments(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching comments:', error)
      setLoading(false)
    }
  }

  async function addComment() {
    if (!newComment.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('poem_comments')
        .insert([
          {
            poem_id: poemId,
            user_id: user?.id || null,
            content: newComment,
          },
        ])
        .select('*, profiles(username, avatar_url)')

      if (error) throw error

      if (data) {
        setComments([data[0], ...comments])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>

      {/* Comment Form */}
      <Card className="p-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts on this poem..."
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
        />
        <Button onClick={addComment} disabled={!newComment.trim()} className="mt-4">
          Post Comment
        </Button>
      </Card>

      {/* Comments List */}
      {loading ? (
        <p className="text-muted-foreground">Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">
                    {comment.profiles?.username || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <p className="leading-relaxed">{comment.content}</p>
              <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Heart className="h-4 w-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  )
}

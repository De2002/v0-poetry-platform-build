'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface ModernPoem {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  likes_count: number
  comments_count: number
  users?: {
    username: string
    avatar_url?: string
  }
}

export default function ModernPoemPage({ params }: { params: { id: string } }) {
  const [poem, setPoem] = useState<ModernPoem | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<any[]>([])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchPoem()
    fetchComments()
  }, [params.id])

  async function fetchPoem() {
    try {
      const { data, error } = await supabase
        .from('modern_poems')
        .select('*, users(username, avatar_url)')
        .eq('id', params.id)
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
        .select('*, users(username, avatar_url)')
        .eq('poem_id', params.id)
        .order('created_at', { ascending: false })

      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  async function toggleLike() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signup')
      return
    }

    if (isLiked) {
      await supabase
        .from('modern_poem_likes')
        .delete()
        .eq('poem_id', params.id)
        .eq('user_id', user.id)

      setIsLiked(false)
      setLikeCount(Math.max(0, likeCount - 1))
    } else {
      await supabase.from('modern_poem_likes').insert({
        poem_id: params.id,
        user_id: user.id,
      })

      setIsLiked(true)
      setLikeCount(likeCount + 1)
    }
  }

  async function postComment() {
    if (!commentText.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signup')
      return
    }

    try {
      const { data } = await supabase
        .from('modern_poem_comments')
        .insert({
          poem_id: params.id,
          user_id: user.id,
          content: commentText,
        })
        .select('*, users(username, avatar_url)')

      if (data) {
        setComments([data[0], ...comments])
        setCommentText('')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  async function sharePoem() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poem?.title,
          text: poem?.content,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!poem) return <div className="flex items-center justify-center min-h-screen">Poem not found</div>

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          ←
        </Button>
        <span className="text-sm font-medium">Poem</span>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Poem Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          {/* Title */}
          <h1 className="text-5xl font-bold font-serif mb-8">{poem.title}</h1>

          {/* Poem Content */}
          <div className="text-2xl font-serif italic leading-relaxed mb-12 max-w-2xl">
            "{poem.content}"
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-12">
            {poem.users?.avatar_url && (
              <Image
                src={poem.users.avatar_url}
                alt={poem.users.username}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div className="text-left">
              <p className="font-semibold">{poem.users?.username}</p>
              <p className="text-gray-400 text-sm">
                {formatDistanceToNow(new Date(poem.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-8 mb-12">
            <button
              onClick={toggleLike}
              className={`flex flex-col items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-xs">{likeCount}</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-white">
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs">{comments.length}</span>
            </button>
            <button
              onClick={sharePoem}
              className="flex flex-col items-center gap-2 text-gray-400 hover:text-white"
            >
              <Share2 className="w-6 h-6" />
            </button>
            <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-white">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full max-w-2xl border-t border-gray-700"></div>
        </div>

        {/* Comments Section */}
        <div className="px-6 py-8 border-t border-gray-700">
          <h2 className="text-xl font-bold mb-6">Comments</h2>

          {/* Comment Input */}
          <div className="flex gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white"
                rows={3}
              />
              <Button
                onClick={postComment}
                disabled={!commentText.trim()}
                className="mt-3 w-full"
              >
                Post
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {comment.users?.avatar_url && (
                  <Image
                    src={comment.users.avatar_url}
                    alt={comment.users.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm">{comment.users?.username}</p>
                  <p className="text-gray-300">{comment.content}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

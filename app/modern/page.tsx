'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function ModernPage() {
  const [activeTab, setActiveTab] = useState('feed')
  const [poems, setPoems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        // For now, using mock data - will integrate with API
        const mockPoems = [
          {
            id: '1',
            title: 'Oasis',
            content: 'You are an oasis, and I am undone by thirst.\n\nThe sun has had me for days,\nmy skin tight with wanting,\nmy mouth remembering...',
            author: 'noronic',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            likes_count: 1,
            comments_count: 0,
          },
          {
            id: '2',
            title: 'Poem 19',
            content: 'I was a teen, a distraction\nI learned to believe I was unimportant\nMy happiness didn\'t matter\nMy voice couldn\'t reach you...',
            author: 'poetjourney',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            likes_count: 5,
            comments_count: 2,
          },
        ]
        setPoems(mockPoems)
      } catch (error) {
        console.error('Error fetching poems:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPoems()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Modern Poetry Feed</h1>
              <p className="mt-4 text-muted-foreground">
                Discover and share contemporary poetry with a passionate community of writers and readers.
              </p>
            </div>
            <Button asChild>
              <Link href="/modern/submit">Share Your Poem</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Your Feed</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>

            {/* Your Feed Tab */}
            <TabsContent value="feed" className="py-8">
              <div className="space-y-6">
                {loading ? (
                  <p className="text-center text-muted-foreground">Loading poems...</p>
                ) : poems.length > 0 ? (
                  poems.map((poem) => (
                    <PoemCard key={poem.id} poem={poem} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No poems yet. Be the first to share!</p>
                )}
              </div>
            </TabsContent>

            {/* Recent Tab */}
            <TabsContent value="recent" className="py-8">
              <div className="space-y-6">
                {loading ? (
                  <p className="text-center text-muted-foreground">Loading poems...</p>
                ) : poems.length > 0 ? (
                  poems.map((poem) => (
                    <PoemCard key={poem.id} poem={poem} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No poems yet.</p>
                )}
              </div>
            </TabsContent>

            {/* Following Tab */}
            <TabsContent value="following" className="py-8">
              <div className="space-y-6">
                <p className="text-center text-muted-foreground">
                  Follow poets to see their latest work here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

function PoemCard({ poem }: { poem: any }) {
  const [isLiked, setIsLiked] = useState(false)

  const timeAgo = formatDistanceToNow(new Date(poem.created_at), { addSuffix: true })

  return (
    <Card className="p-6">
      <Link href={`/modern-poems/${poem.id}`} className="block hover:opacity-80 transition-opacity">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold">{poem.title}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold">by {poem.author}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 whitespace-pre-wrap font-serif text-base leading-relaxed line-clamp-4">
          {poem.content}
          {poem.content.length > 200 && <span className="text-muted-foreground">...</span>}
        </div>
      </Link>

      <Button asChild variant="link" className="mt-4 p-0">
        <Link href={`/modern-poems/${poem.id}`}>
          Read more →
        </Link>
      </Button>

      <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : ''}`} />
          {poem.likes_count} like{poem.likes_count !== 1 ? 's' : ''}
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <MessageCircle className="h-5 w-5" />
          {poem.comments_count} comment{poem.comments_count !== 1 ? 's' : ''}
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </Card>
  )
}

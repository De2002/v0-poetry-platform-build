'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function ModernPage() {
  const [activeTab, setActiveTab] = useState('feed')

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
                {/* Sample Poem Card */}
                <PoemCard
                  title="Oasis"
                  author="noronic"
                  timestamp="Yesterday"
                  content="You are an oasis, and I am undone by thirst.\n\nThe sun has had me for days,\nmy skin tight with wanting,\nmy mouth remembering..."
                  likes={1}
                  comments={0}
                />
                <PoemCard
                  title="Poem 19"
                  author="poetjourney"
                  timestamp="2 days ago"
                  content="I was a teen, a distraction\nI learned to believe I was unimportant\nMy happiness didn't matter\nMy voice couldn't reach you..."
                  likes={5}
                  comments={2}
                />
              </div>
            </TabsContent>

            {/* Recent Tab */}
            <TabsContent value="recent" className="py-8">
              <div className="space-y-6">
                <PoemCard
                  title="Oasis"
                  author="noronic"
                  timestamp="Yesterday"
                  content="You are an oasis, and I am undone by thirst.\n\nThe sun has had me for days,\nmy skin tight with wanting,\nmy mouth remembering..."
                  likes={1}
                  comments={0}
                />
              </div>
            </TabsContent>

            {/* Following Tab */}
            <TabsContent value="following" className="py-8">
              <div className="space-y-6">
                <PoemCard
                  title="Poem 19"
                  author="poetjourney"
                  timestamp="2 days ago"
                  content="I was a teen, a distraction\nI learned to believe I was unimportant\nMy happiness didn't matter\nMy voice couldn't reach you..."
                  likes={5}
                  comments={2}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

function PoemCard({
  title,
  author,
  timestamp,
  content,
  likes,
  comments,
}: {
  title: string
  author: string
  timestamp: string
  content: string
  likes: number
  comments: number
}) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold">by {author}</span>
            <span>•</span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 whitespace-pre-wrap font-serif text-base leading-relaxed">
        {content}
        <span className="text-muted-foreground">...</span>
      </div>

      <Button variant="link" className="mt-4 p-0">
        Read more →
      </Button>

      <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : ''}`} />
          {likes} like{likes !== 1 ? 's' : ''}
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <MessageCircle className="h-5 w-5" />
          {comments} comment{comments !== 1 ? 's' : ''}
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </Card>
  )
}

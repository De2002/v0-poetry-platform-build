'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Quote of the Day Section */}
      <section className="border-b border-[#d4c5b0] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-medium tracking-widest text-muted-foreground">QUOTE OF THE DAY</p>
          
          <blockquote className="mt-8">
            <p className="text-4xl font-serif italic text-foreground">
              "Hope is the thing with feathers that perches in the soul."
            </p>
            <p className="mt-6 text-lg font-serif text-foreground">— Emily Dickinson</p>
          </blockquote>

          <Button
            asChild
            className="mt-8 bg-[#2c3e50] hover:bg-[#1a252f] text-white"
          >
            <Link href="/poems/hope-is-the-thing-with-feathers">
              Read Full Poem →
            </Link>
          </Button>
        </div>
      </section>

      {/* Creative Writing Prompts */}
      <section className="border-b border-[#d4c5b0] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-foreground">
            Creative Writing Prompts
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Under a Midnight Moon',
                description: 'Write about a secret rendezvous beneath the stars.',
                image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop',
                author: 'Sarah J.',
              },
              {
                title: 'The Forgotten Room',
                description: 'Describe an abandoned room full of memories.',
                image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
                author: 'Mark T.',
              },
              {
                title: 'Whispers of Autumn',
                description: 'Capture the feeling of the first chill of fall.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
                author: 'Lisa K.',
              },
            ].map((prompt) => (
              <div key={prompt.title} className="group relative overflow-hidden rounded-lg">
                <div className="relative h-40 md:h-48 w-full overflow-hidden bg-black">
                  <Image
                    src={prompt.image}
                    alt={prompt.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-70 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                  <div>
                    <h3 className="font-serif text-xl font-bold">{prompt.title}</h3>
                    <p className="mt-2 text-sm">{prompt.description}</p>
                  </div>

                  <Button
                    size="sm"
                    className="w-fit bg-[#2c3e50] hover:bg-[#1a252f]"
                  >
                    Write From This
                  </Button>
                </div>

                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Prompt by {prompt.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Poems from Community */}
      <section className="border-b border-[#d4c5b0] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-foreground">
            Latest Poems from the Community
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'City Lights',
                author: 'Mayat',
                image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop',
                likes: 1,
                comments: 0,
              },
              {
                title: 'Echoes of Silence',
                author: 'PoetJohn',
                image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
                likes: 1,
                comments: 0,
              },
              {
                title: 'Sunset Dreams',
                author: 'LitaWrites',
                image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400&h=250&fit=crop',
                likes: 1,
                comments: 0,
              },
            ].map((poem) => (
              <Card key={poem.title} className="overflow-hidden">
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={poem.image}
                    alt={poem.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                    <h3 className="font-serif text-xl font-bold text-white">{poem.title}</h3>
                    <p className="text-sm text-white/90">by {poem.author}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-border flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {poem.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {poem.comments}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Did You Know */}
      <section className="border-b border-[#d4c5b0] py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex gap-8 items-center rounded-lg border-2 border-[#c9b5a0] bg-[#faf7f2] p-12">
            <div className="flex-shrink-0">
              <div className="relative h-32 w-32 md:h-40 md:w-40 overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                  alt="Edgar Allan Poe"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold text-foreground">Did You Know?</h3>
              <p className="mt-4 font-serif text-lg italic leading-relaxed text-foreground">
                Edgar Allan Poe was afraid of being buried alive and often wrote about premature burial in his stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* From Our Blog */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-foreground">
            From Our Blog
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                category: 'WRITING TIPS',
                title: '10 Tips for Aspiring Poets',
                image: 'https://images.unsplash.com/photo-1507842217343-583f20270066?w=400&h=250&fit=crop',
                categoryColor: 'bg-[#5a4a3a]',
              },
              {
                category: 'LITERARY HISTORY',
                title: 'The Romantics: A Literary Era',
                image: 'https://images.unsplash.com/photo-1507842217343-583f20270066?w=400&h=250&fit=crop',
                categoryColor: 'bg-[#5a4a3a]',
              },
              {
                category: 'PERSONAL ESSAY',
                title: 'My Journey into Poetry',
                image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop',
                categoryColor: 'bg-[#8b4545]',
              },
            ].map((article) => (
              <Card key={article.title} className="overflow-hidden">
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className={`${article.categoryColor} text-white text-xs font-bold tracking-wider inline-block px-3 py-1 rounded`}>
                    {article.category}
                  </div>

                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">
                    {article.title}
                  </h3>

                  <Button
                    asChild
                    variant="link"
                    className="mt-4 p-0 text-foreground hover:text-primary"
                  >
                    <Link href="#">Read More →</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

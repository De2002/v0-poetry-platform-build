import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

export default function HomePage() {
  const prompts = [
    {
      title: 'Under a Midnight Moon',
      description: 'Write about a secret rendezvous beneath the stars.',
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop',
      author: 'Sarah J.',
    },
    {
      title: 'The Forgotten Room',
      description: 'Describe an abandoned room full of memories.',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
      author: 'Mark T.',
    },
    {
      title: 'Whispers of Autumn',
      description: 'Capture the feeling of the first chill of fall.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      author: 'Lisa K.',
    },
  ]

  const poems = [
    {
      title: 'City Lights',
      author: 'Mayat',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      likes: 1,
    },
    {
      title: 'Echoes of Silence',
      author: 'PoetJohn',
      image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
      likes: 1,
    },
    {
      title: 'Sunset Dreams',
      author: 'LitaWrites',
      image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400&h=300&fit=crop',
      likes: 1,
    },
  ]

  const articles = [
    {
      category: 'WRITING TIPS',
      title: '10 Tips for Aspiring Poets',
      image: 'https://images.unsplash.com/photo-1507842872343-583f20270319?w=600&h=400&fit=crop',
    },
    {
      category: 'LITERARY HISTORY',
      title: 'The Romantics: A Literary Era',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop',
    },
    {
      category: 'PERSONAL ESSAY',
      title: 'My Journey into Poetry',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Quote of the Day */}
      <section className="border-b border-[#d4c5b0] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-medium tracking-widest text-muted-foreground">QUOTE OF THE DAY</p>
          <blockquote className="mt-8">
            <p className="font-serif text-4xl italic text-foreground">
              "Hope is the thing with feathers that perches in the soul."
            </p>
            <p className="mt-6 font-serif text-lg text-foreground">— Emily Dickinson</p>
          </blockquote>
          <Button asChild className="mt-8 bg-[#2c3e50] hover:bg-[#1a252f] text-white">
            <Link href="/poems/hope-is-the-thing-with-feathers">Read Full Poem →</Link>
          </Button>
        </div>
      </section>

      {/* Creative Writing Prompts */}
      <section className="border-b border-[#d4c5b0] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-center text-3xl font-bold text-foreground">
            Creative Writing Prompts
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {prompts.map((prompt, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="group relative overflow-hidden rounded-lg">
                  <div className="relative h-48 w-full overflow-hidden bg-black">
                    <Image
                      src={prompt.image}
                      alt={prompt.title}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-85 transition-opacity"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                    <div>
                      <h3 className="font-serif text-xl font-bold">{prompt.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed">{prompt.description}</p>
                    </div>
                    <Button size="sm" className="w-fit bg-[#2c3e50] hover:bg-[#1a252f]">
                      Write From This
                    </Button>
                  </div>
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
          <h2 className="font-serif text-center text-3xl font-bold text-foreground">
            Latest Poems from the Community
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {poems.map((poem, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={poem.image}
                    alt={poem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                    <h3 className="font-serif text-xl font-bold text-white">{poem.title}</h3>
                    <p className="text-sm text-white/90">by {poem.author}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border p-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">{poem.likes}</span>
                  </div>
                  <div className="flex gap-3">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <Share2 className="h-4 w-4 text-muted-foreground" />
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
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center rounded-lg border-2 border-[#c9b5a0] bg-[#faf7f2] p-8 md:p-12">
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
          <h2 className="font-serif text-center text-3xl font-bold text-foreground">
            From Our Blog
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {articles.map((article, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute right-4 top-4 inline-block bg-red-600 px-3 py-1 text-xs font-bold text-white rounded">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold text-foreground">{article.title}</h3>
                  <Button asChild variant="link" className="mt-4 p-0">
                    <Link href="/blog">Read More →</Link>
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

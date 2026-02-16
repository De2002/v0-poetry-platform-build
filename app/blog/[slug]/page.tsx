import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react'

const blogPosts: Record<
  string,
  {
    title: string
    category: string
    date: string
    author: string
    readTime: string
    excerpt: string
    content: string
  }
> = {
  'tips-for-aspiring-poets': {
    title: '10 Tips for Aspiring Poets',
    category: 'Writing Tips',
    date: 'Feb 15, 2026',
    author: 'Sarah Mitchell',
    readTime: '8 min read',
    excerpt: 'Learn the fundamentals of poetry writing with these essential tips for beginners.',
    content: `# 10 Tips for Aspiring Poets

Poetry is one of the most beautiful and expressive forms of literature. Whether you're just starting your journey or looking to improve your craft, these essential tips will help you grow as a poet.

## 1. Read Widely and Often

The best way to improve your poetry is to read as much as you can. Explore different styles, eras, and poets. From classic poets like Shakespeare and Dickinson to contemporary voices, each brings unique perspectives and techniques.

## 2. Find Your Authentic Voice

Don't try to imitate others. Your unique perspective and voice are your greatest assets. Write about what matters to you, and let your personality shine through your work.

## 3. Master the Basics First

Before breaking rules, learn them. Understand meter, rhythm, rhyme schemes, and stanzas. These foundations will serve you well, even if you eventually choose to experiment with free verse.

## 4. Practice Regularly

Write every day if possible. Keep a poetry journal, experiment with prompts, and don't worry about perfection. The more you write, the better you'll become.

## 5. Embrace Metaphor and Imagery

Poetry thrives on vivid imagery and meaningful metaphors. Instead of saying "I was sad," show the reader your sadness through sensory details and figurative language.

## 6. Start with What You Know

Write about your experiences, emotions, and observations. Authentic emotion resonates with readers far more than fabricated sentiments.

## 7. Learn from Feedback

Share your work with trusted readers or writing groups. Constructive criticism helps you identify weak areas and strengthen your voice.

## 8. Edit and Revise

First drafts are rarely perfect. Set your work aside, then return with fresh eyes. Revision is where poetry truly comes alive.

## 9. Experiment with Form

Try different poetic forms: sonnets, haikus, free verse, or experimental structures. Each form offers unique challenges and rewards.

## 10. Be Patient with Yourself

Poetry is a journey, not a destination. Celebrate small victories, learn from rejections, and keep writing. The path to becoming a great poet takes time and dedication.

Remember, every great poet started exactly where you are now. Keep your pen moving and your heart open.`,
  },
  'romantic-era': {
    title: 'The Romantics: A Literary Era',
    category: 'Literary History',
    date: 'Feb 10, 2026',
    author: 'James Patterson',
    readTime: '12 min read',
    excerpt: 'Explore the Romantic movement and its profound influence on modern poetry.',
    content: `# The Romantics: A Literary Era That Changed Everything

The Romantic era, spanning roughly from 1798 to 1850, fundamentally transformed literature and poetry. This period emphasized emotion, individualism, and the beauty of nature—values that continue to influence writers today.

## What Defines the Romantic Movement?

Romanticism emerged as a reaction against the rationalism and industrialization of the Enlightenment. Romantic poets sought to celebrate emotion, imagination, and the sublime beauty of nature.

Key characteristics include:
- Emphasis on emotion and intuition over reason
- Celebration of nature and natural landscapes
- Focus on the individual and personal experience
- Exploration of the exotic and supernatural
- Rebellion against social conventions

## The Major Romantic Poets

### William Wordsworth
Wordsworth revolutionized poetry by writing about ordinary people and everyday experiences in simple, direct language. His focus on nature as a source of spiritual truth became foundational to Romantic poetry.

### Samuel Taylor Coleridge
Coleridge brought imagination and the supernatural into poetry. Works like "The Rime of the Ancient Mariner" demonstrated poetry's power to transport readers to fantastical realms.

### Lord Byron
Byron embodied the Romantic ideal of the tortured artist. His dramatic narratives and personal controversies made him a celebrity, influencing how society viewed poets.

### Keats, Shelley, and Blake
These poets each contributed unique voices to the movement, exploring themes of love, mortality, freedom, and spirituality.

## Lasting Legacy

The Romantic era's influence extends far beyond the 19th century. Modern poets continue to draw inspiration from Romantic themes of nature, emotion, and individualism. The movement proved that poetry could be personal, revolutionary, and beautiful all at once.`,
  },
  'journey-into-poetry': {
    title: 'My Journey Into Poetry',
    category: 'Personal Essay',
    date: 'Feb 5, 2026',
    author: 'Emily Chen',
    readTime: '10 min read',
    excerpt: 'A writer shares their personal story of discovering and falling in love with poetry.',
    content: `# My Journey Into Poetry

I never planned to become a poet. In fact, I spent most of my teenage years convinced that poetry was boring, pretentious, and completely irrelevant to my life. That changed one rainy afternoon in my university library.

## The Moment Everything Changed

I was supposed to be studying for a history exam, but my eyes caught a slim volume on a nearby shelf: "Ariel" by Sylvia Plath. Something made me pull it down. I read one poem, then another, and suddenly I was crying—really crying—in the middle of the university library.

Plath's words articulated feelings I didn't even know I had. Her raw honesty, her refusal to soften her emotions for comfort, spoke to something deep within me. I realized that poetry wasn't decoration or pretension—it was truth condensed into its most essential form.

## Finding My Voice

The discovery of Plath led me to other poets. I found solace in Mary Oliver's nature writing, strength in Maya Angelou's resilience, and joy in the clever wordplay of contemporary poets on social media.

I started writing, tentatively at first. My early attempts were clumsy and derivative, but I kept writing. I filled notebooks with terrible sonnets, experimental free verse, and raw journal entries that barely qualified as poems. But slowly, my voice emerged.

## Growth Through Community

Joining a local poetry group transformed my writing. Sharing my work with others and hearing their vulnerable offerings created a space where poetry felt not like an academic exercise, but a beautiful way to connect with other human beings.

## Poetry as Medicine

Over the years, poetry became my therapist, my journal, my best friend. During difficult times, writing helped me process grief, anger, and confusion. During joyful moments, it helped me capture fleeting feelings before they disappeared.

## Where I Am Now

Today, poetry is woven into every part of my life. I write daily, read constantly, and find community with other poets. I've been published in small journals, performed at open mics, and had the profound privilege of watching my words move people.

## An Invitation

If you've never read poetry or tried writing it, I encourage you to give it a chance. You don't need to understand it all. You just need to be open to it. Find a poet who speaks to you. Read their words. Write your own. You might be surprised by what you discover.`,
  },
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    return {
      title: 'Post Not Found | WordStack',
      description: 'The blog post you are looking for does not exist.',
    }
  }

  return {
    title: `${post.title} | WordStack Blog`,
    description: post.excerpt,
  }
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-6 -ml-2">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

            <p className="text-lg text-muted-foreground">{post.excerpt}</p>

            <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
              {post.content.split('\n').map((line, idx) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-3xl font-bold">
                      {line.replace('# ', '')}
                    </h1>
                  )
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-2xl font-bold">
                      {line.replace('## ', '')}
                    </h2>
                  )
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-xl font-bold">
                      {line.replace('### ', '')}
                    </h3>
                  )
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={idx} className="ml-6 list-disc">
                      {line.replace('- ', '')}
                    </li>
                  )
                }
                if (line.trim() === '') {
                  return null
                }
                return (
                  <p key={idx} className="text-muted-foreground">
                    {line}
                  </p>
                )
              })}
            </div>
          </Card>

          {/* Author Bio */}
          <Card className="mt-12 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">
                  {post.author.split(' ')[0][0]}
                  {post.author.split(' ')[1][0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{post.author}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  A passionate writer and poet who loves exploring the intersection of emotion and language.
                </p>
              </div>
            </div>
          </Card>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/blog">Browse More Posts</Link>
            </Button>
          </div>
        </div>
      </section>
    </article>
  )
}

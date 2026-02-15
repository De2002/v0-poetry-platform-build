import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Poetry Blog | WordStack',
  description: 'Insights, tips, and stories about poetry. Learn about literary history, writing techniques, and more.',
}

export default function BlogPage() {
  const blogPosts = [
    {
      title: '10 Tips for Aspiring Poets',
      category: 'Writing Tips',
      date: 'Feb 15, 2026',
      excerpt: 'Learn the fundamentals of poetry writing with these essential tips for beginners.',
      slug: 'tips-for-aspiring-poets',
    },
    {
      title: 'The Romantics: A Literary Era',
      category: 'Literary History',
      date: 'Feb 10, 2026',
      excerpt: 'Explore the Romantic movement and its profound influence on modern poetry.',
      slug: 'romantic-era',
    },
    {
      title: 'My Journey Into Poetry',
      category: 'Personal Essay',
      date: 'Feb 5, 2026',
      excerpt: 'A writer shares their personal story of discovering and falling in love with poetry.',
      slug: 'journey-into-poetry',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Poetry Blog</h1>
          <p className="mt-4 text-muted-foreground">
            Insights, tips, and stories about poetry. Explore literary history, writing techniques,
            and the art of verse.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <Card key={post.slug} className="overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {post.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="mt-4 text-2xl font-bold hover:text-primary">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
                  <Button asChild variant="link" className="mt-4 p-0">
                    <Link href={`/blog/${post.slug}`}>
                      Read More →
                    </Link>
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

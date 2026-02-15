import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Poetry Collections | WordStack',
  description: 'Create and explore curated poetry collections. Share your favorite poems with the community.',
}

export default function CollectionsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Poetry Collections</h1>
              <p className="mt-4 text-muted-foreground">
                Create and explore curated collections of poetry. Share your favorite poems and themes
                with the community.
              </p>
            </div>
            <Button asChild>
              <Link href="/auth/signup">Create Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="rounded-lg border border-dashed border-border p-12 text-center">
            <h2 className="text-2xl font-bold">No collections yet</h2>
            <p className="mt-4 text-muted-foreground">
              Sign in to create your own poetry collection and share it with the community.
            </p>
            <Button asChild className="mt-6">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  )
}

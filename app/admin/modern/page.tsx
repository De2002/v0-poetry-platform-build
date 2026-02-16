import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Modern Poems Moderation',
}

export default function ModernModeration() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Modern Poetry Moderation</h2>
        <p className="text-muted-foreground mt-1">
          Review and manage modern poetry submissions
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">
          Modern poetry moderation features coming soon. Currently, modern poets can submit poems directly through the platform.
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/dashboard">Back to Dashboard</Link>
        </Button>
      </Card>
    </div>
  )
}

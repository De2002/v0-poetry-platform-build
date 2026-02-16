import { PoemForm } from '@/components/poem-form'

export const metadata = {
  title: 'Add New Poem',
}

export default function NewPoemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Add New Poem</h2>
        <p className="text-muted-foreground mt-1">
          Create a new classic poem entry - all poems published immediately
        </p>
      </div>

      <PoemForm />
    </div>
  )
}

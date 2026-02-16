import { PoetForm } from '@/components/poet-form'

export const metadata = {
  title: 'Add New Poet',
}

export default function NewPoetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Add New Poet</h2>
        <p className="text-muted-foreground mt-1">
          Create a new classic poet entry
        </p>
      </div>

      <PoetForm />
    </div>
  )
}

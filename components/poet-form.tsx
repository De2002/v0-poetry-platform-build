'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

interface PoetFormProps {
  poet?: {
    id: string
    name: string
    slug: string
    bio?: string
    birth_year?: number
    death_year?: number
    image_url?: string
  }
  isEditing?: boolean
}

export function PoetForm({ poet, isEditing = false }: PoetFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: poet?.name || '',
    slug: poet?.slug || '',
    bio: poet?.bio || '',
    birth_year: poet?.birth_year || '',
    death_year: poet?.death_year || '',
    image_url: poet?.image_url || '',
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing && poet) {
        // Update existing poet
        const { error: updateError } = await supabase
          .from('poets')
          .update({
            name: formData.name,
            slug: formData.slug,
            bio: formData.bio || null,
            birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
            death_year: formData.death_year ? parseInt(formData.death_year) : null,
            image_url: formData.image_url || null,
          })
          .eq('id', poet.id)

        if (updateError) throw updateError
        router.push('/admin/classics/poets')
      } else {
        // Create new poet
        const { error: insertError } = await supabase
          .from('poets')
          .insert([{
            name: formData.name,
            slug: formData.slug,
            bio: formData.bio || null,
            birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
            death_year: formData.death_year ? parseInt(formData.death_year) : null,
            image_url: formData.image_url || null,
          }])

        if (insertError) throw insertError
        router.push('/admin/classics/poets')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Poet Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., Emily Dickinson"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="auto-generated"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">Auto-generated from name</p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2">Biography</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Write a brief biography about the poet..."
            rows={4}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Birth Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Birth Year</label>
            <input
              type="number"
              value={formData.birth_year}
              onChange={(e) => setFormData(prev => ({ ...prev, birth_year: e.target.value }))}
              placeholder="e.g., 1830"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Death Year */}
          <div>
            <label className="block text-sm font-medium mb-2">Death Year</label>
            <input
              type="number"
              value={formData.death_year}
              onChange={(e) => setFormData(prev => ({ ...prev, death_year: e.target.value }))}
              placeholder="e.g., 1886"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Poet' : 'Create Poet'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

interface PoemFormProps {
  poem?: {
    id: string
    title: string
    slug: string
    poet_id: string
    text: string
    summary?: string
    intro?: string
    meta_title?: string
    meta_description?: string
    word_count?: number
    line_count?: number
    is_published?: boolean
  }
  isEditing?: boolean
}

interface Poet {
  id: string
  name: string
}

export function PoemForm({ poem, isEditing = false }: PoemFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [poets, setPoets] = useState<Poet[]>([])

  const [formData, setFormData] = useState({
    title: poem?.title || '',
    slug: poem?.slug || '',
    poet_id: poem?.poet_id || '',
    text: poem?.text || '',
    summary: poem?.summary || '',
    intro: poem?.intro || '',
    meta_title: poem?.meta_title || '',
    meta_description: poem?.meta_description || '',
    word_count: poem?.word_count || '',
    line_count: poem?.line_count || '',
  })

  useEffect(() => {
    fetchPoets()
  }, [])

  const fetchPoets = async () => {
    const { data } = await supabase
      .from('poets')
      .select('id, name')
      .order('name', { ascending: true })
    
    if (data) {
      setPoets(data as Poet[])
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const countLines = (text: string) => {
    return text.split('\n').filter(line => line.trim().length > 0).length
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value)
    }))
  }

  const handleTextChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      text: value,
      word_count: countWords(value),
      line_count: countLines(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing && poem) {
        // Update existing poem
        const { error: updateError } = await supabase
          .from('poems')
          .update({
            title: formData.title,
            slug: formData.slug,
            poet_id: formData.poet_id,
            text: formData.text,
            summary: formData.summary || null,
            intro: formData.intro || null,
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            word_count: formData.word_count ? parseInt(formData.word_count) : null,
            line_count: formData.line_count ? parseInt(formData.line_count) : null,
            is_published: true,
          })
          .eq('id', poem.id)

        if (updateError) throw updateError
        router.push('/admin/classics/poems')
      } else {
        // Create new poem
        const { error: insertError } = await supabase
          .from('poems')
          .insert([{
            title: formData.title,
            slug: formData.slug,
            poet_id: formData.poet_id,
            text: formData.text,
            summary: formData.summary || null,
            intro: formData.intro || null,
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            word_count: formData.word_count ? parseInt(formData.word_count) : null,
            line_count: formData.line_count ? parseInt(formData.line_count) : null,
            is_published: true,
          }])

        if (insertError) throw insertError
        router.push('/admin/classics/poems')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Poem Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g., Hope Is the Thing with Feathers"
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
          <p className="text-xs text-muted-foreground mt-1">Auto-generated from title</p>
        </div>

        {/* Poet */}
        <div>
          <label className="block text-sm font-medium mb-2">Poet</label>
          <select
            value={formData.poet_id}
            onChange={(e) => setFormData(prev => ({ ...prev, poet_id: e.target.value }))}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select a poet</option>
            {poets.map(poet => (
              <option key={poet.id} value={poet.id}>
                {poet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Poem Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Poem Text</label>
          <textarea
            value={formData.text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Paste or type the full poem text..."
            rows={10}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
            required
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium mb-2">Summary</label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Brief summary of the poem..."
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Intro */}
        <div>
          <label className="block text-sm font-medium mb-2">Introduction</label>
          <textarea
            value={formData.intro}
            onChange={(e) => setFormData(prev => ({ ...prev, intro: e.target.value }))}
            placeholder="Introduction to display on the poem page..."
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* SEO Section */}
        <div className="border-t border-border pt-6">
          <h3 className="font-medium mb-4">SEO Metadata</h3>
          
          <div className="space-y-4">
            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Meta Title</label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                placeholder="SEO title (60 characters)"
                maxLength={60}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.meta_title.length}/60
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="SEO description (160 characters)"
                maxLength={160}
                rows={2}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.meta_description.length}/160
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Word Count</label>
            <input
              type="number"
              value={formData.word_count}
              onChange={(e) => setFormData(prev => ({ ...prev, word_count: e.target.value }))}
              placeholder="Auto-calculated"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Line Count</label>
            <input
              type="number"
              value={formData.line_count}
              onChange={(e) => setFormData(prev => ({ ...prev, line_count: e.target.value }))}
              placeholder="Auto-calculated"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Poem' : 'Publish Poem'}
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

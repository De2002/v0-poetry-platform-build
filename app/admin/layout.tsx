import { ReactNode } from 'react'
import { AdminNav } from '@/components/admin-nav'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'WordStack admin panel for managing classic and modern poetry',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-muted/30">
        <AdminNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background px-8 py-6 sticky top-0 z-40">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

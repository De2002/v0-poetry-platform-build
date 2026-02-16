'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Users, FileText, BarChart3, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: BarChart3,
  },
  {
    label: 'Classic Poets',
    href: '/admin/classics/poets',
    icon: Users,
  },
  {
    label: 'Classic Poems',
    href: '/admin/classics/poems',
    icon: BookOpen,
  },
  {
    label: 'Modern Poems',
    href: '/admin/modern',
    icon: FileText,
  },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="h-full flex flex-col p-4">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen className="h-6 w-6" />
          <span>WordStack Admin</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full justify-start gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </nav>
  )
}

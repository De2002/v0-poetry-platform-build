'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Chrome, Mail } from 'lucide-react'
import { useState } from 'react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: emailError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (emailError) {
        setError(emailError.message)
        return
      }

      router.push('/')
    } catch (err) {
      setError('Failed to sign in with email')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (googleError) {
        setError(googleError.message)
      }
    } catch (err) {
      setError('Failed to sign in with Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-muted-foreground">Welcome back to WordStack</p>
        </div>

        {/* Google Sign In */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          size="lg"
          className="w-full"
          variant="outline"
        >
          <Chrome className="mr-2 h-4 w-4" />
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">Or sign in with email</span>
          </div>
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} size="lg" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign In with Email'}
          </Button>
        </form>

        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

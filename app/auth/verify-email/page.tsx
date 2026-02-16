'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyEmail() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get email from session storage if available
    const storedEmail = sessionStorage.getItem('signup_email')
    if (storedEmail) {
      setEmail(storedEmail)
      sessionStorage.removeItem('signup_email')
    }
    setLoading(false)
  }, [])

  if (loading) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="mt-4 text-muted-foreground">
            {email
              ? `We've sent a confirmation link to ${email}`
              : "We've sent a confirmation link to your email address"}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We've sent a confirmation link to your email. Click the link to verify your account.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn't receive the email? Check your spam folder.
          </p>
          <p className="text-xs text-muted-foreground">
            For testing: You can proceed directly to <Link href="/auth/signin" className="text-primary hover:underline">sign in</Link> after confirming via the email link.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Already verified?{' '}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

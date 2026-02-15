import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://wordstack.app'),
  title: {
    default: 'WordStack - Classic Poetry & Modern Poets',
    template: '%s | WordStack',
  },
  description:
    'WordStack is the most structured SEO-optimized public domain poetry archive. Discover classic poems, explore famous poets, and share modern poetry.',
  keywords: [
    'poetry',
    'classic poems',
    'poets',
    'public domain',
    'poetry archive',
    'famous poems',
    'romantic poetry',
    'Victorian poetry',
  ],
  authors: [{ name: 'WordStack' }],
  creator: 'WordStack',
  publisher: 'WordStack',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wordstack.app',
    siteName: 'WordStack',
    title: 'WordStack - Classic Poetry & Modern Poets',
    description: 'The most structured SEO-optimized public domain poetry archive',
    images: [
      {
        url: 'https://wordstack.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WordStack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordStack - Classic Poetry & Modern Poets',
    description: 'The most structured SEO-optimized public domain poetry archive',
    images: ['https://wordstack.app/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1f2937',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

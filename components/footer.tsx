import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg">WordStack</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The most structured SEO-optimized public domain poetry archive.
            </p>
          </div>

          {/* Classics Section */}
          <div>
            <h4 className="font-semibold">Classics</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/poets" className="text-muted-foreground hover:text-foreground">
                  Browse Poets
                </Link>
              </li>
              <li>
                <Link href="/classics" className="text-muted-foreground hover:text-foreground">
                  Classic Poems
                </Link>
              </li>
              <li>
                <Link href="/themes" className="text-muted-foreground hover:text-foreground">
                  Themes
                </Link>
              </li>
              <li>
                <Link href="/eras" className="text-muted-foreground hover:text-foreground">
                  Literary Eras
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h4 className="font-semibold">Community</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/modern" className="text-muted-foreground hover:text-foreground">
                  Modern Poetry
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-muted-foreground hover:text-foreground">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} WordStack. All classic poems are in the public domain.
          </p>
        </div>
      </div>
    </footer>
  )
}

# WordStack - Poetry Platform

WordStack is a modern, SEO-optimized poetry platform combining a comprehensive archive of classic public domain poetry with a vibrant community for modern poets.

## Features

### Classic Poetry Archive
- **1000+ Classic Poems** organized by poet, theme, and literary era
- **SEO-Optimized Pages** with proper heading structure, meta tags, and structured data (JSON-LD)
- **Advanced Organization** with themes (Love, Nature, Death, etc.) and literary eras (Romantic, Victorian, Modernist)
- **Fast Search & Discovery** with clean URLs and responsive design
- **Breadcrumb Navigation** for improved UX and SEO

### Modern Poetry Platform
- **Social Feed** - Browse poems by "Your Feed", "Recent", or "Following"
- **User Accounts** - Sign up and create a profile
- **Like & Comment** - Engage with poetry from the community
- **Follow Poets** - Never miss new works from your favorite poets
- **Create Collections** - Curate and share poetry collections

### Technical Features
- **Dark/Light Mode** - Full theme support with persistence
- **Responsive Design** - Mobile-first design for all devices
- **XML Sitemap** - Automatic sitemap generation for SEO
- **Structured Data** - JSON-LD schema markup for poems, poets, and articles
- **Row-Level Security** - Supabase RLS policies for data protection

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL with Auth)
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## Database Schema

### Core Tables
- **poets** - Classic poets with bio, birth/death years, and era
- **poems** - Both classic and user-generated poems with metadata
- **themes** - Poetry themes (Love, Nature, Death, etc.)
- **literary_eras** - Historical literary movements
- **poem_themes** - Many-to-many relationship between poems and themes

### Social Features
- **users** - User profiles linked to Supabase Auth
- **modern_poems** - User-generated poetry
- **follows** - User follow relationships
- **likes** - Like interactions on poems
- **comments** - Comment threads
- **collections** - User-created poetry collections
- **collection_poems** - Many-to-many relationship for collections

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. Run the database migration:
```bash
# The schema is in scripts/01-create-schema.sql
# Execute via Supabase SQL Editor
```

4. Seed the database with classic poems:
```bash
node scripts/seed-db.mjs
```

5. Start development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the app.

## Project Structure

```
app/
├── page.tsx                 # Homepage
├── layout.tsx              # Root layout with theme provider
├── globals.css             # Global styles and design tokens
├── poets/
│   ├── page.tsx            # Poets listing
│   └── [slug]/page.tsx      # Individual poet page
├── poems/
│   └── [slug]/page.tsx      # Individual poem page (with JSON-LD)
├── themes/
│   ├── page.tsx            # Themes listing
│   └── [slug]/page.tsx      # Individual theme page
├── eras/
│   └── page.tsx            # Literary eras page
├── classics/page.tsx       # All classic poems listing
├── modern/page.tsx         # Modern poetry feed
├── collections/page.tsx    # User collections
├── blog/page.tsx           # Blog/articles
├── about/page.tsx          # About page
├── auth/signup/page.tsx    # Sign up/sign in
├── sitemap.ts              # Dynamic sitemap for SEO
components/
├── navbar.tsx              # Navigation bar with theme toggle
├── footer.tsx              # Footer with links
├── theme-provider.tsx      # Next-themes provider
lib/
├── supabase/
│   ├── client.ts           # Supabase client for browser
│   └── server.ts           # Supabase client for server
public/
└── robots.txt              # Robots configuration for SEO
```

## Key Pages & Routes

- `/` - Homepage with featured content
- `/classics` - All classic poems
- `/poets` - All poets directory
- `/poets/[slug]` - Individual poet page
- `/poems/[slug]` - Individual poem page with full analysis
- `/themes` - Browse by theme
- `/themes/[slug]` - Poems organized by theme
- `/eras` - Literary eras
- `/modern` - Modern poetry feed
- `/collections` - User poetry collections
- `/blog` - Poetry blog and articles
- `/about` - About WordStack
- `/auth/signup` - Authentication

## SEO Features

- **XML Sitemap** - Automatically generated with proper priority and frequency
- **Robots.txt** - Configured for search engine crawling
- **Structured Data** - JSON-LD schema for Articles and Persons
- **Meta Tags** - Optimized titles, descriptions, and Open Graph tags
- **Clean URLs** - Semantic URL structure: `/poems/poem-title`, `/poets/poet-name`
- **Mobile Optimization** - Mobile-first responsive design
- **Fast Performance** - Optimized images, lazy loading, efficient queries
- **Breadcrumb Navigation** - Helps SEO and user navigation

## Development

### Environment Variables
Create `.env.local` with Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Database Seed
To add more poems, modify `scripts/seed-db.mjs` and run:
```bash
node scripts/seed-db.mjs
```

### Building for Production
```bash
pnpm build
pnpm start
```

## Design System

The project uses:
- **Colors**: Primary brand color with neutral grays, semantic design tokens
- **Typography**: Clean sans-serif font (Geist) with proper sizing hierarchy
- **Spacing**: Tailwind spacing scale (4px base unit)
- **Components**: shadcn/ui components for consistency
- **Dark Mode**: Full dark/light theme support with system preference detection

## Future Enhancements

- Advanced search with filters
- User comments and discussions
- Poet following and notifications
- Advanced analytics
- API for third-party integrations
- Mobile app
- Poem sharing features
- User-generated themes and collections
- Literary analysis AI
- Audio narrations of poems

## License

All classic poems are in the public domain. The WordStack platform is proprietary.

## Support

For issues or questions, please visit the About page or contact support.

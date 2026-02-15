## Error Type
Build Error

## Error Message
Export createClientSupabaseClient doesn't exist in target module

## Build Output
./components/poem-interactions.tsx:6:1
Export createClientSupabaseClient doesn't exist in target module
  4 | import { Button } from '@/components/ui/button'
  5 | import { Heart, Share2 } from 'lucide-react'
> 6 | import { createClient } from '@/lib/supabase/client'
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  7 |
  8 | export function PoemInteractions({
  9 |   poemId,

The export createClientSupabaseClient was not found in module [project]/lib/supabase/client.ts [app-client] (ecmascript).
Did you mean to import createClient?
All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist.

Import trace:
  Server Component:
    ./components/poem-interactions.tsx
    ./app/poems/[slug]/page.tsx

Next.js version: 16.1.6 (Turbopack)

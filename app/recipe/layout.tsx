import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recipe App',
  description: 'Discover and manage your favorite recipes.',
}


export default function RecipeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

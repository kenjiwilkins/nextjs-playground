import { CategoryCards } from "./components/category-cards"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recipe Collection | Kenji Wilkins",
  description:
    "Discover and manage your favorite recipes. Browse by category and find delicious dishes.",
  openGraph: {
    title: "Recipe Collection | Kenji Wilkins",
    description:
      "Discover and manage your favorite recipes. Browse by category and find delicious dishes.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/recipe`,
    siteName: "Kenji Wilkins",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recipe Collection | Kenji Wilkins",
    description:
      "Discover and manage your favorite recipes. Browse by category and find delicious dishes.",
    creator: "@kenjiwilkins",
  },
}

export default function RecipePage() {
  return (
    <main className="flex items-center justify-center py-8">
      <CategoryCards />
    </main>
  )
}

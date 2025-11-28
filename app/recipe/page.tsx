import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { SignInButton } from "./components/sign-in-button"
import { RecipeHeader } from "./components/recipe-header"
import { UnauthorizedUI } from "./components/unauthorized-ui"
import { CategoryCards } from "./components/category-cards"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const url = `${baseUrl}/recipe`
  const title = "Recipe Collection | Kenji Wilkins"
  const description =
    "Discover and manage your favorite recipes. Browse by category and find delicious dishes."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Kenji Wilkins",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@kenjiwilkins",
    },
  }
}

export default async function RecipePage() {
  const session = await getServerSession(authOptions)

  // Case 1: User is not authenticated
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <SignInButton />
      </main>
    )
  }

  // Case 2: User is authenticated but not a guild member
  // isGuildMember will be false if user is not in the required guild
  // isGuildMember will be undefined if DISCORD_GUILD_ID is not set or guild check failed
  if (session.isGuildMember === false) {
    return <UnauthorizedUI userName={session.user?.name} userEmail={session.user?.email} />
  }

  // Case 3: User is authenticated and is a guild member (or guild check is disabled)
  return (
    <div className="min-h-screen">
      <RecipeHeader session={session} />
      <main className="flex items-center justify-center py-8">
        <CategoryCards />
      </main>
    </div>
  )
}

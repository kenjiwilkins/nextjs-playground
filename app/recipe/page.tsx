import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { SignInButton } from "./components/sign-in-button"
import { RecipeHeader } from "./components/recipe-header"
import { UnauthorizedUI } from "./components/unauthorized-ui"
import { CategoryCards } from "./components/category-cards"

export const dynamic = "force-dynamic"

export default async function RecipePage() {
  const session = await getServerSession(authOptions)
  console.log("RecipePage session:", session)

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

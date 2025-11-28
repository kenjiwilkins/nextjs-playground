import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { SignInButton } from "./components/sign-in-button"
import { UnauthorizedUI } from "./components/unauthorized-ui"
import { RecipeHeader } from "./components/recipe-header"

export const dynamic = "force-dynamic"

export default async function RecipeLayout({ children }: { children: React.ReactNode }) {
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
  if (session.isGuildMember === false) {
    return <UnauthorizedUI userName={session.user?.name} userEmail={session.user?.email} />
  }

  // Case 3: User is authenticated and is a guild member
  return (
    <div className="min-h-screen">
      <RecipeHeader session={session} />
      {children}
    </div>
  )
}

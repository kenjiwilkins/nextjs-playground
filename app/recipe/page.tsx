import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { SignInButton } from "./components/sign-in-button"
import { SignOutButton } from "./components/sign-out-button"

export const dynamic = "force-dynamic"

export default async function RecipePage() {
  const session = await getServerSession(authOptions)
  console.log("RecipePage session:", session)

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <SignInButton />
      </main>
    )
  }

  const guilds = session.guilds ?? []

  return (
    <div>
      <h1>Recipe Page</h1>
      <div>
        <h2>{session.user?.name}</h2>
        <h3>Your Guilds ({guilds.length})</h3>
        <ul>
          {guilds.map((guild) => (
            <li key={guild.id}>
              {guild.id} - {guild.name}
            </li>
          ))}
        </ul>
        <SignOutButton />
      </div>
    </div>
  )
}

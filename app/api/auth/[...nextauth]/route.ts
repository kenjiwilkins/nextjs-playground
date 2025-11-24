import NextAuth, { NextAuthOptions } from "next-auth"
import Discord from "next-auth/providers/discord"
import { getGuilds, isInGuild, DiscordGuild } from "@/lib/discord"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    isGuildMember?: boolean
    guilds?: DiscordGuild[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    isGuildMember?: boolean
    guilds?: DiscordGuild[]
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token

        // Fetch and store guilds on sign-in
        if (account.access_token) {
          const guilds = await getGuilds(account.access_token)
          token.guilds = guilds
          console.log("User's guilds:", guilds)

          // Check if user is in the required guild
          if (process.env.DISCORD_GUILD_ID) {
            const isMember = isInGuild(guilds, process.env.DISCORD_GUILD_ID)
            token.isGuildMember = isMember
            console.log(
              `User is${isMember ? "" : " not"} a member of guild ${process.env.DISCORD_GUILD_ID}`
            )
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.isGuildMember = token.isGuildMember
      session.guilds = token.guilds
      return session
    },
  },
}

const handlers = NextAuth(authOptions)

export { handlers as GET, handlers as POST }

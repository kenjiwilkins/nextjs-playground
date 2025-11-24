export interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
}

export async function getGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const data = await response.json()

  if (!response.ok || !Array.isArray(data)) {
    console.error("Failed to fetch guilds:", data)
    return []
  }

  return data
}

export function isInGuild(guilds: DiscordGuild[], guildId: string): boolean {
  return guilds.some((guild) => guild.id === guildId)
}

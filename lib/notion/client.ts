import { Client } from "@notionhq/client"

// Notion API Client singleton instance

let notionClient: Client | null = null

/**
 * Get the Notion API Client instance.
 * Should be used on server side only.
 */
export function getNotionClient(): Client {
  if (!notionClient) {
    const apiKey = process.env.NOTION_API_KEY

    if (!apiKey) {
      throw new Error("NOTION_API_KEY is not defined in environment variables")
    }

    notionClient = new Client({ auth: apiKey })
  }

  return notionClient
}

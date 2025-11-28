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

/**
 * Get the Notion Bookshelf Database ID.
 */
export function getNotionBookshelfDbId(): string {
  const dbId = process.env.NOTION_BOOKSHELF_DB_ID

  if (!dbId) {
    throw new Error("NOTION_BOOKSHELF_DB_ID is not defined in environment variables")
  }

  return dbId
}

/**
 *  Get the Notion Bookshelf Data Source ID.
 */
export function getNotionBookshelfDataSourceId(): string {
  const dataSourceId = process.env.NOTION_BOOKSHELF_DATA_SOURCE_ID

  if (!dataSourceId) {
    throw new Error("NOTION_BOOKSHELF_DATA_SOURCE_ID is not defined in environment variables")
  }

  return dataSourceId
}

/**
 * Get the Notion Recipe Data Source ID.
 */
export function getNotionRecipeDataSourceId(): string {
  const dataSourceId = process.env.NOTION_RECIPE_DATA_SOURCE_ID

  if (!dataSourceId) {
    throw new Error("NOTION_RECIPE_DATA_SOURCE_ID is not defined in environment variables")
  }

  return dataSourceId
}

export function getNotionRecipeNibblesPageId(): string {
  const pageId = process.env.NOTION_RECIPE_NIBBLES_PAGE_ID

  if (!pageId) {
    throw new Error("NOTION_RECIPE_NIBBLES_PAGE_ID is not defined in environment variables")
  }

  return pageId
}

/**
 * Validate notion configuration.
 */
export function validateNotionConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!process.env.NOTION_API_KEY) {
    errors.push("NOTION_API_KEY is not defined in environment variables")
  }

  if (!process.env.NOTION_BOOKSHELF_DB_ID) {
    errors.push("NOTION_BOOKSHELF_DB_ID is not defined in environment variables")
  }

  if (!process.env.NOTION_BOOKSHELF_DATA_SOURCE_ID) {
    errors.push("NOTION_BOOKSHELF_DATA_SOURCE_ID is not defined in environment variables")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

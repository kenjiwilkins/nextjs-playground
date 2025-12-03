"use server"
import {
  getNotionClient,
  getNotionRecipePreservePageId,
  getNotionRecipeDataSourceId,
} from "@/lib/notion/client"
import { recipesQueryResponseSchema } from "@/lib/notion/types"

const notionClient = getNotionClient()
const recipeDataSourceId = getNotionRecipeDataSourceId()
const recipePreservePageId = getNotionRecipePreservePageId()

export async function fetchPreserveRecipes(nextCursor?: string) {
  const response = await notionClient.dataSources.query({
    data_source_id: recipeDataSourceId,
    filter: {
      property: "tags",
      relation: {
        contains: recipePreservePageId,
      },
    },
    page_size: 50,
    start_cursor: nextCursor || undefined,
  })
  // Validate and parse the response with Zod
  const parsed = recipesQueryResponseSchema.safeParse(response)
  if (!parsed.success) {
    console.error("Failed to parse Notion response:", parsed.error)
    throw new Error("Failed to fetch preserve recipes from Notion.")
  }

  return parsed.data
}

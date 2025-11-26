"use server"
import {
  getNotionClient,
  getNotionRecipeNibblesPageId,
  getNotionRecipeDataSourceId,
} from "@/lib/notion/client"
import { recipesQueryResponseSchema } from "@/lib/notion/types"

const notionClient = getNotionClient()
const recipeDataSourceId = getNotionRecipeDataSourceId()
const recipeNibblesPageId = getNotionRecipeNibblesPageId()

export async function fetchNibblesRecipes(nextCursor?: string) {
  const response = await notionClient.dataSources.query({
    data_source_id: recipeDataSourceId,
    filter: {
      property: "tags",
      relation: {
        contains: recipeNibblesPageId,
      },
    },
    page_size: 5,
    start_cursor: nextCursor || undefined,
  })
  // Validate and parse the response with Zod
  const parsed = recipesQueryResponseSchema.safeParse(response)
  if (!parsed.success) {
    console.error("Failed to parse Notion response:", parsed.error)
    throw new Error("Failed to fetch nibbles recipes from Notion.")
  }

  return parsed.data
}

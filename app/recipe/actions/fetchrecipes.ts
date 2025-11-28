"use server"
import { getNotionClient, getNotionRecipeDataSourceId } from "@/lib/notion/client"
import {
  recipesQueryResponseSchema,
  recipeItemSchema,
  type RecipesQueryResponse,
} from "@/lib/notion/types"

const notionClient = getNotionClient()
const recipeDataSourceId = getNotionRecipeDataSourceId()

export async function fetchRecipes(nextCursor?: string): Promise<RecipesQueryResponse> {
  const response = await notionClient.dataSources.query({
    data_source_id: recipeDataSourceId,
    filter_properties: ["Name", "tags", "tagName"],
    ...(nextCursor ? { start_cursor: nextCursor } : {}),
  })

  // Validate and parse the response with Zod
  const parsed = recipesQueryResponseSchema.safeParse(response)
  if (!parsed.success) {
    console.error("Failed to parse Notion response:", parsed.error)
    throw new Error("Failed to fetch recipes from Notion.")
  }

  return parsed.data
}

export async function fetchRecipeMetadata(pageId: string): Promise<{
  name: string
  tags: string[]
}> {
  const page = await notionClient.pages.retrieve({ page_id: pageId })

  let name = ""
  let tags: string[] = []

  const parsed = recipeItemSchema.safeParse(page)
  if (parsed.success) {
    name = parsed.data.properties.Name.title[0]?.plain_text || "Untitled Recipe"
    tags =
      parsed.data.properties.tagName?.rollup.array
        .map((tag) => tag.title[0]?.plain_text || "")
        .filter(Boolean) || []
  } else {
    name = "Untitled Recipe"
    tags = []
  }

  return { name, tags }
}

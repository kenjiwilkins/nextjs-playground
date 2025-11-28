import {
  getNotionClient,
  getNotionRecipeDataSourceId,
  getNotionRecipeNibblesPageId,
} from "./client"
import { AnyNotionBlock, notionBlockSchema, unsupportedNotionBlockSchema } from "./types"

const notionClient = getNotionClient()
const recipeDataSourceId = getNotionRecipeDataSourceId()
const recipeNibblesPageId = getNotionRecipeNibblesPageId()

export async function getNibblesRecipes() {
  return await notionClient.dataSources.query({
    data_source_id: recipeDataSourceId,
    filter: {
      property: "tags",
      relation: {
        contains: recipeNibblesPageId,
      },
    },
    page_size: 5,
  })
}

export async function getRecipePageBlocks(pageId: string): Promise<AnyNotionBlock[]> {
  const blocks: AnyNotionBlock[] = []
  const response = await notionClient?.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  })

  // validate each block
  for (const block of response?.results || []) {
    const parsedBlocks = notionBlockSchema.safeParse(block)
    if (parsedBlocks.success) {
      blocks.push(parsedBlocks.data)
    } else {
      const unsupportedBlock = unsupportedNotionBlockSchema.parse(block)
      blocks.push(unsupportedBlock)
      if (process.env.NODE_ENV === "development") {
        console.warn("Unsupported Notion block:", block)
      }
    }
  }
  return blocks
}

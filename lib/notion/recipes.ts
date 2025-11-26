import {
  getNotionClient,
  getNotionRecipeDataSourceId,
  getNotionRecipeNibblesPageId,
} from "./client"

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

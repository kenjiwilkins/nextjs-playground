import { getNotionClient, getNotionBookshelfDataSourceId } from "./client"
import { AnyNotionBlock, notionBlockSchema, unsupportedNotionBlockSchema } from "./types"

const notionClient = getNotionClient()
const bookshelfDataSourceId = getNotionBookshelfDataSourceId()

export async function getBookshelfBooks() {
  return await notionClient.dataSources.query({
    data_source_id: bookshelfDataSourceId,
    filter_properties: ["Title", "Author_Name", "Status", "Date_Read", "Rollup"],
    sorts: [
      {
        property: "Reading",
        direction: "ascending",
      },
    ],
  })
}

import { cacheLife } from "next/cache"

export async function getPageBlocks(pageId: string): Promise<AnyNotionBlock[]> {
  "use cache"
  cacheLife("days")
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

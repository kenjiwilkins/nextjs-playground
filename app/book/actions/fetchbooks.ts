"use server"
import { getNotionClient, getNotionBookshelfDataSourceId } from "@/lib/notion/client"
import { booksQueryResponseSchema, type BooksQueryResponse } from "@/lib/notion/types"

const notionClient = getNotionClient()
const bookshelfDataSourceId = getNotionBookshelfDataSourceId()

export async function fetchBooks(nextCursor?: string): Promise<BooksQueryResponse> {
  const response = await notionClient.dataSources.query({
    data_source_id: bookshelfDataSourceId,
    filter_properties: ["Title", "Author_Name", "Status", "Date_Read", "Rollup", "Rate"],
    sorts: [
      {
        property: "Reading",
        direction: "ascending",
      },
    ],
    ...(nextCursor ? { start_cursor: nextCursor } : {}),
  })
  console.log("Notion response:", response.results[0])

  // Validate and parse the response with Zod
  const parsed = booksQueryResponseSchema.safeParse(response)
  if (!parsed.success) {
    console.error("Failed to parse Notion response:", parsed.error)
    throw new Error("Failed to fetch books from Notion.")
  }

  return parsed.data
}

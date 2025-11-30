import { getNotionBookshelfDataSourceId, getNotionClient } from "@/lib/notion/client"
import { bookItemSchema, booksQueryResponseSchema } from "@/lib/notion/types"
import { cacheLife } from "next/cache"

const notionClient = getNotionClient()
const bookshelfDataSourceId = getNotionBookshelfDataSourceId()

export async function getBookshelfBooks(nextCursor?: string) {
  "use cache"
  cacheLife("days")
  try {
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
    const parsed = booksQueryResponseSchema.safeParse(response)
    if (!parsed.success) {
      console.error("Failed to parse Notion response:", parsed.error)
      throw new Error("Failed to fetch books from Notion.")
    }

    return parsed.data
  } catch (error) {
    console.error("Error fetching bookshelf books:", error)
    throw error
  }
}

export async function getBookMetadata(pageId: string) {
  "use cache"
  cacheLife("days")
  try {
    const page = await notionClient.pages.retrieve({ page_id: pageId })

    let title = ""
    let author = ""
    let status = ""
    let dateRead = ""
    let rate = ""
    let isbn = ""

    const parsed = bookItemSchema.safeParse(page)
    if (parsed.success) {
      title = parsed.data.properties.Title.title[0]?.plain_text || "Untitled"
      author = parsed.data.properties.Author_Name?.rollup.array[0].title[0]?.plain_text || "Unknown"
      status = parsed.data.properties.Status?.status?.name || "Unknown"
      dateRead = parsed.data.properties.Date_Read?.date?.start || ""
      rate = parsed.data.properties.Rate?.select?.name || ""
      isbn = parsed.data.properties.ISBN?.rich_text[0]?.plain_text || ""
    } else {
      title = "Untitled"
      author = "Unknown"
      status = "Unknown"
      dateRead = ""
      rate = ""
      isbn = ""
    }
    return { title, author, status, dateRead, rate, isbn }
  } catch (error) {
    console.error("Error fetching book metadata:", error)
    throw error
  }
}

"use server"
import { getNotionClient, getNotionBookshelfDataSourceId } from "@/lib/notion/client"
import {
  booksQueryResponseSchema,
  bookItemSchema,
  type BooksQueryResponse,
} from "@/lib/notion/types"

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

  // Validate and parse the response with Zod
  const parsed = booksQueryResponseSchema.safeParse(response)
  if (!parsed.success) {
    console.error("Failed to parse Notion response:", parsed.error)
    throw new Error("Failed to fetch books from Notion.")
  }

  return parsed.data
}

export async function fetchBookMetadata(pageId: string): Promise<{
  title: string
  author: string
  status: string
  dateRead: string
  rate: string
  isbn: string
}> {
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
}

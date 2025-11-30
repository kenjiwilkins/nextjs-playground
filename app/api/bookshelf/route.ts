import { getNotionBookshelfDataSourceId, getNotionClient } from "@/lib/notion/client";
import { booksQueryResponseSchema } from "@/lib/notion/types";
import { cacheLife } from "next/cache";
import { NextResponse } from "next/server"

const notionClient = getNotionClient()
const bookshelfDataSourceId = getNotionBookshelfDataSourceId()

export async function GET() {
  try {
    const books = await getBookshelfBooks()
    return NextResponse.json(books, {
      status: 200,
    })
  } catch (error) {
    console.error("Error fetching bookshelf books:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch bookshelf books",
      },
      { status: 500 }
    )
  }
}

async function getBookshelfBooks(nextCursor?: string) {
  'use cache';
  cacheLife('days');
  try {
    const response = await notionClient.dataSources.query({
      data_source_id: bookshelfDataSourceId,
      filter_properties: ["Title", "Author_Name", "Status", "Date_Read", "Rollup"],
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
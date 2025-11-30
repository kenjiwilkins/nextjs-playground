import { getBookshelfBooks } from "@/lib/data/books"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const nextCursor = searchParams.get("nextCursor") || undefined
  try {
    const books = await getBookshelfBooks(nextCursor)
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

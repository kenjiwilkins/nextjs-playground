import { NextRequest, NextResponse } from "next/server"
import { getGoogleBooksClient } from "@/lib/google-books"
import { unstable_cache } from "next/cache"

// Cache the book fetch function for 1 day (86400 seconds)
const getCachedBook = unstable_cache(
  async (isbn: string) => {
    const client = getGoogleBooksClient()
    const book = await client.getBookByISBN(isbn)
    return book
  },
  ["google-books-isbn"],
  {
    revalidate: 86400, // 1 day in seconds
    tags: ["google-books"],
  }
)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isbn = searchParams.get("isbn")

  if (!isbn) {
    return NextResponse.json(
      { error: "ISBN parameter is required" },
      { status: 400 }
    )
  }

  try {
    const book = await getCachedBook(isbn)

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(book, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    })
  } catch (error) {
    console.error("Failed to fetch book from Google Books API:", error)
    return NextResponse.json(
      { error: "Failed to fetch book data" },
      { status: 500 }
    )
  }
}

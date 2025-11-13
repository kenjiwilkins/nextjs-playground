import { NextResponse } from "next/server"
import { getBookshelfBooks } from "@/lib/notion/bookshelf"

// revalidate every day
export const revalidate = 86400

export async function GET() {
  try {
    const books = await getBookshelfBooks()
    return NextResponse.json(books, {
      status: 200,
      headers: {
        "Cache-Control":
          process.env.NODE_ENV === "production"
            ? `public, max-age=0, s-maxage=${revalidate}`
            : "no-store",
      },
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

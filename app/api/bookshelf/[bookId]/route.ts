import { getBookMetadata } from "@/lib/data/books"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params
  try {
    const metadata = await getBookMetadata(bookId)
    return NextResponse.json(metadata, {
      status: 200,
    })
  } catch (error) {
    console.error("Error fetching book metadata:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch book metadata",
      },
      { status: 500 }
    )
  }
}

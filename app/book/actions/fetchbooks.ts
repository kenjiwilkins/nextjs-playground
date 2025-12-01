"use server"
import { getBookMetadata, getBookshelfBooks } from "@/lib/data/books"
import { type BooksQueryResponse } from "@/lib/notion/types"

export async function fetchBooks(nextCursor?: string): Promise<BooksQueryResponse> {
  return getBookshelfBooks(nextCursor)
}

export async function fetchBookMetadata(pageId: string): Promise<{
  title: string
  author: string
  status: string
  dateRead: string
  rate: string
  isbn: string
}> {
  return getBookMetadata(pageId)
}

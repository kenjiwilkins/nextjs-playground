import { getGoogleBooksClient } from "@/lib/google-books"
import { cacheLife } from "next/cache"

// Cache the book fetch function for 1 day (86400 seconds)
export async function getCachedBook(isbn: string) {
  "use cache"
  cacheLife("days")
  const client = getGoogleBooksClient()
  const book = await client.getBookByISBN(isbn)
  return book
}

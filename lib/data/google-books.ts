import { getGoogleBooksClient } from "@/lib/google-books"
import { unstable_cache } from "next/cache"

// Cache the book fetch function for 1 day (86400 seconds)
export const getCachedBook = unstable_cache(
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

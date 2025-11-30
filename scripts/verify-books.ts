import { getBookMetadata } from "../lib/data/books"
import * as dotenv from "dotenv"

dotenv.config()

async function main() {
  const bookId = "2665190f-e05a-4a6e-9fa2-1e5d3f2128f2"
  console.log(`Fetching metadata for bookId: ${bookId}`)
  try {
    const metadata = await getBookMetadata(bookId)
    console.log("Metadata:", metadata)
  } catch (error) {
    console.error("Error fetching metadata:", error)
  }
}

main()

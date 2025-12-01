import { Metadata } from "next"
import Image from "next/image"
import { getPageBlocks } from "@/lib/notion/bookshelf"
import { PageBodyRenderer } from "@/components/ui/notion/page-body-renderer"
import { AnyNotionBlock } from "@/lib/notion/types"
import { fetchBookMetadata, fetchBooks } from "../actions/fetchbooks"
import { Separator } from "@/components/ui/separator"
import { cn, formatISBN } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating"
import BookHeader from "../components/header"
import { type Volume } from "@/lib/google-books"
import { getCachedBook } from "@/lib/data/google-books"

export async function generateStaticParams() {
  const books = await fetchBooks()

  if (books.results.length === 0) {
    const defaultPageId = process.env.NOTION_BOOKSHELF_DEFAULT_PAGE_ID
    if (defaultPageId) {
      return [{ bookId: defaultPageId }]
    }
    return []
  }

  return books.results.map((book) => ({
    bookId: book.id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookId: string }>
}): Promise<Metadata> {
  const { bookId } = await params
  const bookMetadata = await fetchBookMetadata(bookId)
  return {
    title: `${bookMetadata.title} | Kenji Wilkins`,
    description: `Details and notes on the book "${bookMetadata.title}" by ${bookMetadata.author}. Status: ${bookMetadata.status}. Date Read: ${bookMetadata.dateRead}. Rate: ${bookMetadata.rate}. `,
  }
}

const handleBadgeColor = (status: string | null) => {
  switch (status) {
    case "read":
      return cn("bg-green-500 text-white")
    case "reading":
      return cn("bg-blue-500 text-white")
    case "unread":
      return cn("bg-red-500 text-white")
    default:
      return cn("bg-gray-500 text-white")
  }
}

export default async function BookEndPage({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params
  const bookMetadata = await fetchBookMetadata(bookId)

  let Blocks: AnyNotionBlock[] = []
  let error: string | null = null
  try {
    Blocks = await getPageBlocks(bookId)
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error occurred"
  }

  // Fetch Google Books data if ISBN exists
  let googleBooksData: Volume | null = null
  if (bookMetadata.isbn) {
    try {
      const isbns = formatISBN(bookMetadata.isbn)
      if (isbns.length > 0) {
        googleBooksData = await getCachedBook(isbns[0])
      }
    } catch (e) {
      console.error("Failed to fetch Google Books data:", e)
    }
  }

  const coverImage = googleBooksData?.volumeInfo.imageLinks?.thumbnail?.replace(
    "http://",
    "https://"
  )

  if (error) {
    return <div>Error loading page: {error}</div>
  }

  return (
    <div>
      <BookHeader />
      {children}
      <div className="flex justify-center w-full">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-6 p-4">
            {/* Book Cover Image */}
            {coverImage && (
              <figure className="shrink-0">
                <Image
                  src={coverImage}
                  alt={`Cover of ${bookMetadata.title}`}
                  width={128}
                  height={192}
                  className="rounded-lg shadow-lg"
                  unoptimized
                />
                <figcaption className="text-xs text-muted-foreground mt-2 text-center max-w-[128px]">
                  {googleBooksData?.volumeInfo.publisher
                    ? `© ${googleBooksData.volumeInfo.publisher}`
                    : "Image from Google Books"}
                </figcaption>
              </figure>
            )}
            {/* Book Info */}
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl md:text-4xl font-bold">{bookMetadata.title}</h1>
              <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">
                {bookMetadata.author}
              </h2>
              <div className="flex flex-col md:flex-row gap-2">
                <Badge className={handleBadgeColor(bookMetadata.status)}>
                  {bookMetadata.status}
                </Badge>
                {bookMetadata.dateRead && (
                  <span className="text-sm md:text-base">Date Read: {bookMetadata.dateRead}</span>
                )}
                {bookMetadata.rate && (
                  <Rating defaultValue={parseInt(bookMetadata.rate, 10)} readOnly className="gap-0">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton key={index} size={16} className={cn("px-0 text-green-500")} />
                    ))}
                  </Rating>
                )}
              </div>
            </div>
          </div>
          <Separator />
          <PageBodyRenderer className="py-4" blocks={Blocks} />
        </div>
      </div>
    </div>
  )
}

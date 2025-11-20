import { Metadata } from "next"
import { getPageBlocks } from "@/lib/notion/bookshelf"
import { PageBodyRenderer } from "@/components/ui/notion/page-body-renderer"
import { AnyNotionBlock } from "@/lib/notion/types"
import { fetchBookMetadata } from "../actions/fetchbooks"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating"
import BookHeader from "../components/header"

// revalidate the page every day
export const revalidate = 86400

export async function generateStaticParams() {
  const defaultPageId = process.env.NOTION_BOOKSHELF_DEFAULT_PAGE_ID
  if (!defaultPageId) {
    return []
  }
  return [
    {
      bookId: defaultPageId,
    },
  ]
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

  if (error) {
    return <div>Error loading page: {error}</div>
  }

  return (
    <div>
      <BookHeader />
      {children}
      <div className="flex justify-center w-full">
        <div className="container">
          <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl md:text-4xl font-bold">{bookMetadata.title}</h1>
            <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">{bookMetadata.author}</h2>
            <div className="flex flex-col md:flex-row gap-2">
              <Badge className={handleBadgeColor(bookMetadata.status)}>
                {bookMetadata.status}
              </Badge>
              {bookMetadata.dateRead && (
                <span className="text-sm md:text-base">Date Read: {bookMetadata.dateRead}</span>
              )}
              {bookMetadata.rate && (
                <Rating defaultValue={parseInt(bookMetadata.rate, 10)} readOnly className="gap-0">
                  {Array.from({ length: 5}).map((_, index) => (
                    <RatingButton key={index} size={16} className={cn("px-0 text-green-500")} />
                  ))}
                </Rating>
              )}
            </div>
          </div>
          <Separator />
          <PageBodyRenderer className="py-4" blocks={Blocks} />
        </div>
      </div>
      {/* last revalidation, make this only available in dev and staging env in future */}
      <div className="mt-8 text-sm">Last revalidated at: {new Date().toLocaleString()}</div>
    </div>
  )
}

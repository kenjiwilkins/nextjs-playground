import { Metadata } from "next"
import { getPageBlocks } from "@/lib/notion/bookshelf"
import { PageBodyRenderer } from "@/components/ui/notion/page-body-renderer"
import { AnyNotionBlock } from "@/lib/notion/types"
import { fetchBookMetadata } from "../actions/fetchbooks"

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
      {children}
      <div className="">
        <h1 className="text-3xl font-bold">{bookMetadata.title}</h1>
        <p className="text-lg">
          by <span className="font-semibold">{bookMetadata.author}</span>
        </p>
        <p className="mt-2">
          Status: <span className="font-medium">{bookMetadata.status}</span>
        </p>
        {bookMetadata.dateRead && (
          <p>
            Date Read: <span className="font-medium">{bookMetadata.dateRead}</span>
          </p>
        )}
        {bookMetadata.rate && (
          <p>
            Rate: <span className="font-medium">{bookMetadata.rate}</span>
          </p>
        )}
      </div>
      <div className="flex justify-center w-full">
        <div className="container">
          <PageBodyRenderer blocks={Blocks} />
        </div>
      </div>
      {/* last revalidation, make this only available in dev and staging env in future */}
      <div className="mt-8 text-sm">Last revalidated at: {new Date().toLocaleString()}</div>
    </div>
  )
}

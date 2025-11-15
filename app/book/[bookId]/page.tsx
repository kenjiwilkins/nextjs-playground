import { Metadata } from "next"
import { getPageBlocks } from "@/lib/notion/bookshelf"
import { PageBodyRenderer } from "@/components/ui/notion/page-body-renderer"
import { AnyNotionBlock } from "@/lib/notion/types"

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
  return {
    title: bookId,
    description: "Details of the selected book.",
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
      {bookId}
      {children}
      <PageBodyRenderer blocks={Blocks} />
      {/* last revalidation, make this only available in dev and staging env in future */}
      <div className="mt-8 text-sm">Last revalidated at: {new Date().toLocaleString()}</div>
    </div>
  )
}

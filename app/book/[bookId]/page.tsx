import { Metadata } from "next"
import { getPageBlocks } from "@/lib/notion/bookshelf"
import { PageBodyRenderer } from "@/components/ui/notion/page-body-renderer"
import { AnyNotionBlock } from "@/lib/notion/types"

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
    </div>
  )
}

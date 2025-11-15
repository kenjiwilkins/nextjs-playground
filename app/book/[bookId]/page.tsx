import { Metadata } from "next"

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

  return (
    <div>
      {bookId}
      {children}
    </div>
  )
}

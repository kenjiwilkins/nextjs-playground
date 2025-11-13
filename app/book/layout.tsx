import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bookshelf - Kenji Wilkins",
  description: "A collection of books I've read.",
}

export default function BookLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}

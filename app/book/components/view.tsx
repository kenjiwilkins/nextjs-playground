import KeyVisual from "./key-visual"
import BookHeader from "./header"
import BookHero from "./hero"
import BookTable from "./booktable"
import { fetchBooks } from "@/app/book/actions/fetchbooks"

export async function BookPageView() {
  'use cache';
  const data = await fetchBooks()

  return (
    <div className="min-h-screen flex flex-col w-full">
      <BookHeader />
      <main className="flex-1 flex flex-col w-full">
        <KeyVisual />
        <BookHero />
        <BookTable initialProps={data.results} nextCursor={data.next_cursor} />
      </main>
    </div>
  )
}

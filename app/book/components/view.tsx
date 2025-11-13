import KeyVisual from "./key-visual"
import BookHeader from "./header"
import BookHero from "./hero"

export function BookPageView() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <BookHeader />
      <main className="flex-1 flex flex-col w-full">
        <KeyVisual />
        <BookHero />
      </main>
    </div>
  )
}
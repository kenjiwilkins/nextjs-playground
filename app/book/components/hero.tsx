import { BookOpen, Library, Star, TrendingUp } from "lucide-react"

export default function BookHero() {
  return (
    <section className="relative w-full py-12 md:py-20 lg:py-28 flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Main heading */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Reading Collection
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              My Digital <span className="text-primary">Bookshelf</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A curated collection of books I&apos;ve read, currently reading, and want to explore.
              Discover insights, reviews, and recommendations from my reading journey.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 w-full max-w-3xl">
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-border bg-card p-4">
              <Library className="h-6 w-6 text-primary" />
              <div className="text-2xl font-bold">24</div>
              <div className="text-xs text-muted-foreground">Books Read</div>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-border bg-card p-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-muted-foreground">Currently Reading</div>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-border bg-card p-4">
              <Star className="h-6 w-6 text-primary" />
              <div className="text-2xl font-bold">4.2</div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-border bg-card p-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-muted-foreground">This Year</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

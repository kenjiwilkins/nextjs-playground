import Link from "next/link"

export default function Hero() {
  return (
    <section className="flex-1 flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center text-center max-w-2xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            Developer & <span className="text-accent">Book</span> Lover
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Web development insights and book recommendations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Blog
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-8 py-3 border border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-colors"
          >
            Bookshelf
          </Link>
        </div>
      </div>
    </section>
  )
}

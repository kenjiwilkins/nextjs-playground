import ThemeToggle from "@/components/ui/theme-toggle"
import Hero from "./components/hero"
import Navigation from "./components/navigation"

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <Navigation />
      <Hero />
      <ThemeToggle />
    </main>
  )
}

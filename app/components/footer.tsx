import { cacheLife } from "next/cache"
import fs from "node:fs"

export async function AppFooter() {
  "use cache"
  cacheLife("days") // 24 hours
  // read version from package.json
  const packageJson = fs.readFileSync("package.json", "utf-8")

  // get current year
  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-2 right-2 text-xs text-muted-foreground">
      &copy; {currentYear} Kenji Wilkins. Version: v{JSON.parse(packageJson).version}
    </footer>
  )
}

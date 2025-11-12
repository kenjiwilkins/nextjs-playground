"use client"

import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  if (!theme) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-6 left-6"
    >
       {theme === 'dark' ? (
          <Sun />
        ) : (
          <Moon />
       )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats ISBN string(s) by removing hyphens and splitting by comma
 * @param isbnString - Comma-separated ISBN string (e.g., "9784087718799,978-4-08-770001-5")
 * @returns Array of formatted ISBNs without hyphens (e.g., ["9784087718799", "9784087700015"])
 */
export function formatISBN(isbnString: string): string[] {
  if (!isbnString) return []

  return isbnString
    .split(",")
    .map((isbn) => isbn.replace(/-/g, "").trim())
    .filter((isbn) => isbn.length > 0)
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

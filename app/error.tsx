"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error(error)
  }, [error])

  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Something went wrong
            {isDevelopment && <span> at Home page</span>}
          </h1>
          <p className="text-muted-foreground">
            {isDevelopment
              ? error.message
              : "An unexpected error occurred. Please try again."}
          </p>
          {isDevelopment && error.digest && (
            <p className="text-xs text-muted-foreground">
              Error digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="outline">
            Go home
          </Button>
        </div>

        {isDevelopment && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              View error details
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-muted p-4 text-xs">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

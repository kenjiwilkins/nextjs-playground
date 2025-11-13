import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link"

export default function NotFound() {
  return (
    <Empty className="h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <EmptyHeader>
        <EmptyMedia variant="default">
          <h1 className="text-7xl font-bold text-accent">404</h1>
        </EmptyMedia>
        <EmptyTitle className="text-3xl font-semibold text-foreground">Page Not Found</EmptyTitle>
        <EmptyDescription className="text-muted-foreground text-lg">
          Looks like this page doesn&apos;t exist. Let me take you back home.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <Link href="/" className="font-bold">
            Back to Home
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

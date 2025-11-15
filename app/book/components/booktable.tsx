"use client"

import { useActionState } from "react"
import { fetchBooks } from "@/app/book/actions/fetchbooks"
import {
  type BookItem,
  getBookAuthor,
  getBookDateRead,
  getBookRate,
  getBookStatus,
  getBookTitle,
} from "@/lib/notion/types"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating"
import Link from "next/link"

type BooksState = { items: BookItem[]; nextCursor: string | null }

interface BookTableProps {
  initialProps: BookItem[]
  nextCursor: string | null
}

export default function BookTable({ initialProps, nextCursor }: BookTableProps) {
  const initialState: BooksState = { items: initialProps, nextCursor }
  const [state, dispatch, isPending] = useActionState(
    async (prev: BooksState, formData?: FormData) => {
      const cursorFromForm = formData?.get("cursor") as string | null | undefined
      const effectiveCursor = cursorFromForm ?? prev.nextCursor ?? undefined
      const data = await fetchBooks(effectiveCursor)
      return {
        items: [...prev.items, ...data.results],
        nextCursor: data.next_cursor || null,
      } as BooksState
    },
    initialState
  )
  const handleBadgeColor = (status: string | null) => {
    switch (status) {
      case "read":
        return cn("bg-green-500 text-white")
      case "reading":
        return cn("bg-blue-500 text-white")
      case "unread":
        return cn("bg-red-500 text-white")
      default:
        return cn("bg-gray-500 text-white")
    }
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 w-full">
      <Table>
        <TableCaption>
          <form action={dispatch}>
            <input type="hidden" name="cursor" value={state.nextCursor || ""} />
            {state.nextCursor && <button className="w-full py-2 bg-muted rounded-b-lg disabled:opacity-50" disabled={isPending || !state.nextCursor} type="submit">
              <span>{isPending ? "Loading..." : "Load More"}</span>
            </button>}
          </form>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Title</TableHead>
            <TableHead className="text-muted-foreground">Author</TableHead>
            <TableHead className="text-muted-foreground">Date Read</TableHead>
            <TableHead className="text-muted-foreground">Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.items.map((book) => (
            <TableRow key={book.id}>
              <TableCell>
                <Badge className={handleBadgeColor(getBookStatus(book))}>
                  {getBookStatus(book) ?? "unknown"}
                </Badge>
              </TableCell>
              <TableCell className="p-0">
                <Link
                  href={`/book/${book.id}`}
                  className="block w-full h-full underline underline-offset-2 decoration-2 font-semibold"
                >
                  {getBookTitle(book)}
                </Link>
              </TableCell>
              <TableCell>{getBookAuthor(book)}</TableCell>
              <TableCell>{getBookDateRead(book)}</TableCell>
              <TableCell className="flex items-center">
                {!!getBookRate(book) && (
                  <Rating defaultValue={getBookRate(book)} readOnly className="gap-0">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton key={index} size={16} className="px-0 text-green-500" />
                    ))}
                  </Rating>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

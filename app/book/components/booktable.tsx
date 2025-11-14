"use client"

import { useActionState } from "react"
import { fetchBooks } from "@/app/book/actions/fetchbooks"
import { type BookItem, getBookAuthor, getBookTitle } from "@/lib/notion/types"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

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

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 w-full">
      <Table>
        <TableCaption>
          <form action={dispatch}>
            <input type="hidden" name="cursor" value={state.nextCursor || ""} />
            <Button disabled={isPending || !state.nextCursor} type="submit">
              <span>{isPending ? "Loading..." : "Load More"}</span>
            </Button>
          </form>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground">Title</TableHead>
            <TableHead className="text-muted-foreground">Author</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.items.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{getBookTitle(book)}</TableCell>
              <TableCell>{getBookAuthor(book)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

import { z } from "zod"

// Notion property schemas
const notionTitleSchema = z.object({
  title: z.array(
    z.object({
      plain_text: z.string(),
    })
  ),
})

const notionRichTextSchema = z.object({
  rich_text: z
    .array(
      z.object({
        plain_text: z.string(),
      })
    )
    .optional()
    .default([]),
})

const notionSelectSchema = z.object({
  select: z
    .object({
      name: z.string(),
    })
    .nullish(),
})

const notionDateSchema = z.object({
  date: z
    .object({
      start: z.string(),
    })
    .nullish(),
})

const notionNumberSchema = z.object({
  number: z.number().nullish(),
})

// Book properties schema
const bookPropertiesSchema = z.object({
  Title: notionTitleSchema,
  Author_Name: notionRichTextSchema.optional(),
  Status: notionSelectSchema.optional(),
  Date_Read: notionDateSchema.optional(),
  Rollup: notionNumberSchema.optional(),
})

// Book item schema
export const bookItemSchema = z.object({
  id: z.string(),
  properties: bookPropertiesSchema,
})

// Query response schema
export const booksQueryResponseSchema = z.object({
  results: z.array(bookItemSchema),
  next_cursor: z.string().nullable(),
  has_more: z.boolean(),
})

// Inferred types
export type BookItem = z.infer<typeof bookItemSchema>
export type BookProperties = z.infer<typeof bookPropertiesSchema>
export type BooksQueryResponse = z.infer<typeof booksQueryResponseSchema>

// Helper functions to safely get property values
export function getBookTitle(book: BookItem): string {
  return book.properties.Title.title[0]?.plain_text ?? "Untitled"
}

export function getBookAuthor(book: BookItem): string | null {
  const richText = book.properties.Author_Name?.rich_text
  return richText?.[0]?.plain_text ?? null
}

export function getBookStatus(book: BookItem): string | null {
  return book.properties.Status?.select?.name ?? null
}

export function getBookDateRead(book: BookItem): string | null {
  return book.properties.Date_Read?.date?.start ?? null
}

export function getBookRollup(book: BookItem): number | null {
  return book.properties.Rollup?.number ?? null
}

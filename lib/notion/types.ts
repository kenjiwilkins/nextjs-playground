import { z } from "zod"

const richTextAnnotationSchema = z.object({
  bold: z.boolean(),
  italic: z.boolean(),
  strikethrough: z.boolean(),
  underline: z.boolean(),
  code: z.boolean(),
  color: z.string(),
})

const richTextSchema = z.object({
  type: z.literal("text"),
  text: z.object({
    content: z.string(),
    link: z.object({ url: z.string().nullable() }).nullable(),
  }),
  annotations: richTextAnnotationSchema,
  plain_text: z.string(),
  href: z.string().nullable().optional(),
})

const paragraphBlockSchema = z.object({
  id: z.string(),
  type: z.literal("paragraph"),
  paragraph: z.object({
    rich_text: z.array(richTextSchema),
    color: z.string().optional(),
  }),
})

const heading1BlogkSchema = z.object({
  id: z.string(),
  type: z.literal("heading_1"),
  heading_1: z.object({
    rich_text: z.array(richTextSchema),
    color: z.string().optional(),
  }),
})

const heading2BlogkSchema = z.object({
  id: z.string(),
  type: z.literal("heading_2"),
  heading_2: z.object({
    rich_text: z.array(richTextSchema),
    color: z.string().optional(),
  }),
})

const heading3BlogkSchema = z.object({
  id: z.string(),
  type: z.literal("heading_3"),
  heading_3: z.object({
    rich_text: z.array(richTextSchema),
    color: z.string().optional(),
  }),
})

const bulletedListItemBlockSchema = z.object({
  id: z.string(),
  type: z.literal("bulleted_list_item"),
  bulleted_list_item: z.object({
    rich_text: z.array(richTextSchema),
    color: z.string().optional(),
  }),
})

const numberedListItemBlockSchema = z.object({
  id: z.string(),
  type: z.literal("numbered_list_item"),
  numbered_list_item: z.object({
    rich_text: z.array(richTextSchema),
    color: z.string().optional(),
  }),
})

const quoteBlockSchema = z.object({
  id: z.string(),
  type: z.literal("quote"),
  quote: z.object({
    rich_text: z.array(richTextSchema),
    color: z.string().optional(),
  }),
})

const codeBlockSchema = z.object({
  id: z.string(),
  type: z.literal("code"),
  code: z.object({
    rich_text: z.array(richTextSchema),
    color: z.string().optional(),
    language: z.string(),
  }),
})

const imageBlockSchema = z.object({
  id: z.string(),
  type: z.literal("image"),
  image: z.object({
    type: z.enum(["file", "external"]),
    external: z.object({ url: z.string() }).optional(),
    file: z.object({ url: z.string(), expiry_time: z.string().optional() }).optional(),
    caption: z.array(richTextSchema).optional(),
  }),
})

export const notionBlockSchema = z.discriminatedUnion("type", [
  paragraphBlockSchema,
  heading1BlogkSchema,
  heading2BlogkSchema,
  heading3BlogkSchema,
  bulletedListItemBlockSchema,
  numberedListItemBlockSchema,
  quoteBlockSchema,
  codeBlockSchema,
  imageBlockSchema,
])

export const unsupportedNotionBlockSchema = z
  .object({
    id: z.string(),
    type: z.string(),
  })
  .loose()

// Notion property schemas
const notionTitleSchema = z.object({
  title: z.array(
    z.object({
      plain_text: z.string(),
    })
  ),
})

const notionTextSchema = z.object({
  rich_text: z.array(
    z.object({
      plain_text: z.string(),
    })
  ),
})

const notionStatusSchema = z.object({
  status: z
    .object({
      name: z.enum(["read", "unread", "reading"]),
    })
    .nullish(),
})

const notionSelectSchemema = z.object({
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

const notionRelationSchema = z.object({
  relation: z.array(
    z.object({
      id: z.string(),
    })
  ),
})

const notionRollupTitleSchema = z.object({
  rollup: z.object({
    type: z.literal("array"),
    array: z.array(
      z.object({
        type: z.literal("title"),
        title: z.array(
          z.object({
            plain_text: z.string(),
          })
        ),
      })
    ),
  }),
})

// Book properties schema
const bookPropertiesSchema = z.object({
  Title: notionTitleSchema,
  Author_Name: z
    .object({
      rollup: z.object({
        type: z.literal("array"),
        array: z.array(
          z.object({
            type: z.literal("title"),
            title: z.array(
              z.object({
                plain_text: z.string(),
              })
            ),
          })
        ),
      }),
    })
    .optional(),
  Status: notionStatusSchema.optional(),
  Date_Read: notionDateSchema.optional(),
  Rollup: notionNumberSchema.optional(),
  Rate: notionSelectSchemema.optional(),
  ISBN: notionTextSchema.optional(),
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
  const name = book.properties.Author_Name?.rollup.array[0].title ?? [{ plain_text: "Unknown" }]
  if (name && name.length > 0) {
    return name[0].plain_text
  }
  return null
}

export function getBookStatus(book: BookItem): string | null {
  try {
    return book.properties.Status?.status?.name ?? null
  } catch (error) {
    console.error(`failed to get book status:${book.id}`, error)
    return null
  }
}

export function getBookDateRead(book: BookItem): string | null {
  return book.properties.Date_Read?.date?.start ?? null
}

export function getBookRate(book: BookItem): number {
  const bookRate: string | null = book.properties.Rate?.select?.name ?? null
  if (bookRate) {
    return parseInt(bookRate, 10)
  }
  return 0
}

export function getBookRollup(book: BookItem): number | null {
  return book.properties.Rollup?.number ?? null
}

// Recipe properties schema
export const recipePropertiesSchema = z.object({
  Name: notionTitleSchema,
  tags: notionRelationSchema,
  tagName: notionRollupTitleSchema,
})

export const recipeItemSchema = z.object({
  id: z.string(),
  properties: recipePropertiesSchema,
})

export const recipesQueryResponseSchema = z.object({
  results: z.array(recipeItemSchema),
  next_cursor: z.string().nullable(),
  has_more: z.boolean(),
})

// Inferred recipe types
export type RecipeItem = z.infer<typeof recipeItemSchema>
export type RecipeProperties = z.infer<typeof recipePropertiesSchema>
export type RecipesQueryResponse = z.infer<typeof recipesQueryResponseSchema>

// Helper functions to safely get recipe property values
export function getRecipeName(recipe: RecipeItem): string {
  return recipe.properties.Name.title[0]?.plain_text ?? "Untitled Recipe"
}

export function getRecipeTags(recipe: RecipeItem): string[] {
  return (
    recipe.properties.tagName?.rollup.array
      .map((tag) => tag.title[0]?.plain_text || "")
      .filter(Boolean) || []
  )
}

// notion blocks
export type RichText = z.infer<typeof richTextSchema>
export type RichTextAnnotation = z.infer<typeof richTextAnnotationSchema>
export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>
export type Heading1Block = z.infer<typeof heading1BlogkSchema>
export type Heading2Block = z.infer<typeof heading2BlogkSchema>
export type Heading3Block = z.infer<typeof heading3BlogkSchema>
export type BulletedListItemBlock = z.infer<typeof bulletedListItemBlockSchema>
export type NumberedListItemBlock = z.infer<typeof numberedListItemBlockSchema>
export type QuoteBlock = z.infer<typeof quoteBlockSchema>
export type CodeBlock = z.infer<typeof codeBlockSchema>
export type ImageBlock = z.infer<typeof imageBlockSchema>
export type NotionBlock = z.infer<typeof notionBlockSchema>
export type UnsupportedNotionBlock = z.infer<typeof unsupportedNotionBlockSchema>

// Helper type for any Notion block
export type AnyNotionBlock = NotionBlock | UnsupportedNotionBlock
